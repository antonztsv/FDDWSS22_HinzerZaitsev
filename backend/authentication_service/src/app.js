import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import express from "express"
const app = express()
import cors from "cors"
import jwt from "jsonwebtoken"

// express middleware
app.use(cors())
app.use(express.json())

// TODO: AMQP (RabbitMQ) connection

app.get("/", (req, res) => {
  res.send("authentication_service")
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`authentication_service listening on port ${PORT}!`)
})
