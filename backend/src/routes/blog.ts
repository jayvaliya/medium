import { PrismaClient } from '@prisma/client/edge';
import { Hono, Context } from 'hono';
import { decode, sign, verify } from 'hono/jwt';
import { withAccelerate } from '@prisma/extension-accelerate';
import { blogPostSchema, blogUpdateSchema } from '../../../common/src/index';

interface CustomContext extends Context {
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    userId: string,
    prisma: PrismaClient
  }
}

export const blogRouter = new Hono<CustomContext>();

// auth middleware
blogRouter.use('*', async (c, next) => {
  if (c.req.method === "GET") {
    await next();
    return;
  }
  try {
    const jwt = c.req.header('Authorization');
    if (!jwt) {
      c.status(401);
      return c.json({ error: "Unauthorized: No token provided" });
    }

    const token = jwt.split(' ')[1];
    const payload = await verify(token, c.env.JWT_SECRET);

    if (!payload || !payload.userId) {
      c.status(401);
      return c.json({ error: "Unauthorized: Invalid token" });
    }

    // @ts-ignore
    c.set('userId', payload.userId);
    await next();
  } catch (error) {
    c.status(401);
    return c.json({ message: "Error while verifying token", error });
  }
});

// prisma middleware
blogRouter.use("*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // @ts-ignore
  c.set('prisma', prisma);
  await next();
});

// Post new blog
blogRouter.post("/", async (c) => {
  try {
    const body = await c.req.json();

    const parsed = blogPostSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ message: "Invalid input", error: parsed.error }, 400);
    }

    const { title, content } = parsed.data;
    const authorId = c.get("userId");
    if (!authorId) {
      return c.json({ message: "User ID not provided" }, 400);
    }

    const prisma = c.get("prisma");

    // Ensure content is stored as JSON
    const blog = await prisma.blog.create({
      data: {
        title,
        content: content,
        authorId,
      },
    });

    return c.json({ message: "Blog created", blog }, 201);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return c.json({ message: "Error creating blog post", error: error.message }, 500);
  }
});

// update blog
blogRouter.put("/", async (c) => {
  try {
    const body = await c.req.json();

    const parsed = blogUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ message: "invalid input", error: parsed.error }, 400);
    }
    const { title, content, id } = parsed.data;

    const prisma = c.get("prisma");

    const blog = await prisma.blog.update({ where: { id }, data: { title, content } });
    return c.json({ message: "Blog updated", blog });
  } catch (error) {
    c.status(500);
    return c.json({ error: "Error updating blog post", details: error });
  }
});

// get all blogs
blogRouter.get("/bulk", async (c) => {
  try {
    const prisma = c.get("prisma");

    // Extract user ID from token if available
    let userId = null;
    const authHeader = c.req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = await verify(token, c.env.JWT_SECRET);
        // Fix: use userId instead of id
        userId = decoded.userId;
      } catch (error) {
        // Invalid token, continue without user context
      }
    }

    const blogs = await prisma.blog.findMany({
      include: {
        author: {
          select: { id: true, name: true }
        },
        _count: {
          select: { likes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get user likes if authenticated
    const userLikes = new Set();
    if (userId) {
      const likes = await prisma.like.findMany({
        where: {
          userId,
          blogId: { in: blogs.map(b => b.id) }
        },
        select: { blogId: true }
      });

      likes.forEach(like => userLikes.add(like.blogId));
    }

    const transformedBlogs = blogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      author: blog.author,
      createdAt: blog.createdAt.toISOString(),
      likeCount: blog._count.likes,
      userLiked: userLikes.has(blog.id)
    }));

    return c.json({ blogs: transformedBlogs });
  } catch (error) {
    c.status(500);
    return c.json({ error: "Error fetching blogs", details: error });
  }
});

// search blogs
blogRouter.get('/search', async (c) => {
  try {
    const query = c.req.query('query')?.trim();

    if (!query) {
      return c.json({ blogs: [] });
    }

    const prisma = c.get('prisma');

    const blogs = await prisma.blog.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } }
        ]
      }
    });

    return c.json({
      blogs: blogs.length > 0
        ? blogs.map((blog) => ({ id: blog.id, title: blog.title }))
        : []
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return c.json({ error: "Error fetching blogs", details: error.message }, 500);
  }
});

// Get blog with ID
blogRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const prisma = c.get("prisma");

    // Extract user ID from token if available
    let userId = null;
    const authHeader = c.req.header("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = await verify(token, c.env.JWT_SECRET);
        userId = decoded.id;
      } catch (error) {
        console.warn("Invalid token:", error);
      }
    }

    const blog = await prisma.blog.findFirst({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    });

    if (!blog) {
      return c.json({ message: "Blog not found" }, 404);
    }

    // Check if user has liked this blog
    let userLiked = false;
    if (userId) {
      const like = await prisma.like.findFirst({
        where: {
          blogId: id,
          userId
        }
      });
      userLiked = !!like;
    }

    // Return blog with like information
    return c.json({
      blog: {
        ...blog,
        likeCount: blog._count.likes,
        userLiked,
        content: JSON.stringify(blog.content)
      }
    });
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return c.json({ error: "Error fetching blog post", details: error }, 500);
  }
});

// Like/unlike toggle endpoint
blogRouter.post("/:id/like", async (c) => {
  try {
    // Get user from JWT token
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ message: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verify(token, c.env.JWT_SECRET);
    // Fix: use userId instead of id
    const userId = decoded.userId;

    const blogId = c.req.param("id");
    const prisma = c.get("prisma");

    // Check if blog exists
    const blog = await prisma.blog.findUnique({
      where: { id: blogId }
    });

    if (!blog) {
      return c.json({ message: "Blog not found" }, 404);
    }

    // Check if already liked
    const existingLike = await prisma.like.findFirst({
      where: {
        blogId,
        userId
      }
    });

    let liked = false;

    if (existingLike) {
      // Already liked, so unlike
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      });
    } else {
      // Not liked, so create a like
      await prisma.like.create({
        data: {
          blog: { connect: { id: blogId } },
          user: { connect: { id: userId } }
        }
      });
      liked = true;
    }

    // Get updated like count
    const likeCount = await prisma.like.count({
      where: { blogId }
    });

    return c.json({ liked, likeCount });
  } catch (error) {
    console.error("Error liking blog:", error);
    return c.json({ message: "Error processing like", error: error.message }, 500);
  }
});
