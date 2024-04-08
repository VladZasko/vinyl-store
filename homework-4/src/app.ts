import express from "express";
import {RouterPaths} from "./routerPaths";
import {usersRouter} from "./features/users/routers/users.router";
import {postsRouter} from "./features/posts/routers/postRouter";
export const app = express()
export const jsonBodyMiddleWare = express.json()

app.use(jsonBodyMiddleWare)

app.use(RouterPaths.users, usersRouter)
app.use(RouterPaths.posts, postsRouter)