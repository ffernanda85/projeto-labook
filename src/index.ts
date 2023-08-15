import express from "express"
import cors from "cors"
import { userRouter } from "./router/usersRouter"
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT) || 3003, () => {
    console.log(`servidor rodando na porta ${Number(process.env.PORT) || 3003}`)
})

app.use("/users", userRouter)