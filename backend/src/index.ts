// /index.ts

import dotenv from 'dotenv';
dotenv.config();
import { Hono } from 'hono'
import Router from "./routes/api1"
import { PrismaClient } from '@prisma/client/edge'
import { cors } from 'hono/cors'



const app = new Hono();

app.use('*', cors({ origin: '*' }));

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route("/api/v1", Router); //user routes ("/api/vi")


app.all('*', (c) => {
  return c.json({ message: "route not found" })
})

export default app