import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { loginSchema, sighupSchema } from "@jayvaliyaa/medium-common";
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'


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
        // const prisma = c.get('prisma');
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

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

userRouter.post("/login", async (c) => {
    try {
        const body = await c.req.json();

        // const { email, password } = loginSchema.parse(body);
        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            return c.json({ message: "invalid input", error: parsed.error }, 400);
        }
        const { email, password } = parsed.data;

        // @ts-ignore
        const prisma = c.get('prisma');

        const user = await prisma.user.findFirst({ where: { email, password } });
        if (!user) {
            return c.json({ message: "user not found" }, 400);
        }

        const token = await sign({ userId: user.id }, c.env.JWT_SECRET);

        return c.json({ token }, 200);
    } catch (error) {
        return c.json({ message: "error while logging in", error }, 400);
    }
});

userRouter.post("/me", async (c) => {
    try {
        // @ts-ignore
        const prisma = c.get('prisma');
        const body = await c.req.json();
        const token = body['Authorization'];
        
        if(!token) {
            return c.json({ message: "token not found" }, 400);
        }

        const payload = await verify(token, c.env.JWT_SECRET);
        if(!payload || !payload.userId) {
            return c.json({ message: "invalid token" }, 400);
        }
        const user = await prisma.user.findFirst({ where: { id: payload.userId } });
        if (!user) {
            return c.json({ message: "user not found" }, 400);
        }

        return c.json({ user }, 200);
    } catch (error) {
        return c.json({ message: "error while logging in", error }, 400);
    }

})
