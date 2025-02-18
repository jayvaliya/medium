import { PrismaClient } from '@prisma/client/edge';
import { Hono, Context } from 'hono';
import { decode, sign, verify } from 'hono/jwt';
import { withAccelerate } from '@prisma/extension-accelerate';
import { blogPostSchema, blogUpdateSchema } from '@jayvaliyaa/medium-common';

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

blogRouter.use("*", async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // @ts-ignore
  c.set('prisma', prisma);
  await next();
});

// post new blog
blogRouter.post("/", async (c) => {
  // console.log("inside post blog");
  try {
    const body = await c.req.json();

    const parsed = blogPostSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ message: "invalid input", error: parsed.error }, 400);
    }
    const { title, content } = parsed.data;

    const authorId = c.get('userId');
    if (!authorId) {
      return c.json({ message: "User ID not provided" }, 400);
    }

    const prisma = c.get('prisma');

    const blog = await prisma.blog.create({
      data: { title, content, authorId }
    });

    return c.json({ message: "Blog created", blog }, 201);
  } catch (error) {
    console.error("Error creating blog post:", error);
    // @ts-ignore
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

    // Fetch all blogs
    const blogs = await prisma.blog.findMany();

    const transformedBlogs = blogs.map((blog) => {
      return {
        id: blog.id,
        title: blog.title,
        content: blog.content.substring(0, 70).concat("....."),
      };
    });

    // Return the transformed blogs
    return c.json({ blogs: transformedBlogs });
  } catch (error) {
    c.status(500);
    return c.json({ error: "Error fetching blogs", details: error });
  }
});

// search blogs
blogRouter.get('/search', async (c) => {
  try {
    // const query = c.req.param('query')?.trim();
    const query = c.req.query('query')?.trim();

    if (!query) {
      return c.json({ blogs: [] }); // Return empty results if no query is provided
    }

    const prisma = c.get('prisma');

    const blogs = await prisma.blog.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
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


// get blog with id
blogRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const prisma = c.get('prisma');

    const blog = await prisma.blog.findFirst({ where: { id } });
    if (!blog) {
      return c.json({ message: "Blog not found" }, 404);
    }
    return c.json({ blog });
  } catch (error) {
    c.status(500);
    return c.json({ error: "Error fetching blog post", details: error });
  }
});
