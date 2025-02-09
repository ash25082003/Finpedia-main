import express from 'express'
import cors from "cors"
import cookieParser from 'cookie-parser'
import errorHandler from './middlewares/errorHandler.js'


const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({limit : "1000kb"}))
app.use(express.urlencoded({extended : true , limit : "1000kb"}))
app.use(cookieParser())




//route import
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import commentRouter from './routes/comment.routes.js'
import voteRouter from "./routes/vote.routes.js"


// routes declaration

app.use("/api/v1/users" , userRouter)
 // middleware to give acess of route to whom
app.use("/api/v1/post" , postRouter)
app.use("/api/v1/comment" , commentRouter)
app.use("/api/v1/vote" , voteRouter)


app.use(errorHandler);

export {app}










//whenever we use middleware or we have to do config setting
















