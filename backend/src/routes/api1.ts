import { Hono } from "hono";
import {userRouter} from "./user";
import {blogRouter} from "./blog";


const app = new Hono();

app.get("/", (c) => {  
    return c.text("from api/v1 in api.ts!");
});

app.route("/user", userRouter); //user routes ("/api/v1/user")

app.route("/blog", blogRouter); //blog routes ("/api/v1/blog")

export default app;
