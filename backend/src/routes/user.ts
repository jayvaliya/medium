import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { loginSchema, sighupSchema } from "@jayvaliyaa/medium-common";
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'


export const userRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    }
}>();

userRouter.get("/", (c) => {
    return c.text("from api/v1/user");
});

userRouter.use("*", async (c, next) => {
    const pris = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    // @ts-ignore
    c.set('prisma', pris);
    await next();
})

userRouter.post("/signup", async (c) => {
    try {
        const body = await c.req.json();

        // @ts-ignore
        const prisma = c.get('prisma');

        const parsed = sighupSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({ message: "invalid input", error: parsed.error }, 400);
        }
        console.log(parsed);

        const { email, password, name } = parsed.data;

        try {
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password,
                    name
                }
            });
            const token = await sign({ userId: newUser.id }, c.env.JWT_SECRET);
            return c.json({ message: "user created", token }, 200);

        } catch (error) {
            return c.json({ message: "user alrady exists", error }, 400);
        }


    } catch (error) {
        return c.json({ message: "error while creating new user", error }, 400);
    }
});

// signin
userRouter.post("/signin", async (c) => {
    try {
        const body = await c.req.json();

        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({ message: "Invalid input", error: parsed.error.errors }, 400);
        }
        const { email, password } = parsed.data;

        // @ts-ignore
        const prisma = c.get('prisma');

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return c.json({ message: "User not found" }, 400);
        }

        if (user.password !== password) {
            return c.json({ message: "Invalid password" }, 400);
        }

        const token = await sign({ userId: user.id }, c.env.JWT_SECRET);

        return c.json({ token }, 200);
    } catch (error) {
        console.error("Error during login:", error);
        // @ts-ignore
        return c.json({ message: "Error while logging in", error: error.message }, 500);
    }
});

userRouter.get("/me", async (c) => {
    try {
        // @ts-ignore
        const prisma = c.get('prisma');

        const authHeader = c.req.header("Authorization");
        // return c.json({ authHeader });
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return c.json({ message: "Token not found" }, 400);
        }

        const token = authHeader.split(" ")[1];
        const payload = await verify(token, c.env.JWT_SECRET);

        if (!payload || !payload.userId) {
            return c.json({ message: "Invalid token" }, 401);
        }

        const user = await prisma.user.findUnique({ where: { id: payload.userId } });
        if (!user) {
            return c.json({ message: "User not found" }, 404);
        }

        return c.json({ user: { ...user, password: undefined } }, 200);
    } catch (error) {
        console.error("Error while logging in:", error);
        return c.json({ message: "Error while logging in", error: error.message }, 500);
    }
});

// get user profile
userRouter.get("/:id", async (c) => {
    try {
        const userId = c.req.param('id');

        // @ts-ignore
        const prisma = c.get('prisma');

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                posts: {
                    select: {
                        id: true,
                        title: true,
                        content: true,
                        published: true,
                    },
                    take: 5,
                    orderBy: {
                        id: 'desc'
                    }
                }
            }
        });

        if (!user) {
            return c.json({ message: "User not found" }, 404);
        }

        const processedPosts = user.posts.map((post: any) => ({
            ...post,
            content: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : '')
        }));

        const userProfile = {
            ...user,
            posts: processedPosts
        };

        return c.json(userProfile, 200);
    } catch (error: any) {
        console.error("Error fetching user profile:", error);
        return c.json({ message: "Error while fetching profile", error: error.message }, 500);
    }
});