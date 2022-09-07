import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"

import jwt from "jsonwebtoken"

import jackrabbit from "@pager/jackrabbit"

// express middleware
// #####################################

app.use(cors())
app.use(express.json())

// amqp (rabbitmq) connection
// #####################################

const rabbit = jackrabbit(process.env.AMQP_URL)
const exchange = rabbit.default()
const queue = exchange.queue({ name: "task_queue" })

queue.consume((data, ack) => {
  console.log("[AMQP] Message received from " + data.service)
  ack()
})

// express routes
// #####################################

app.get("/", (req, res) => {
  exchange.publish({ service: "authentication_service" }, { key: "task_queue" })

  res.send("authentication_service")
})

// express server start
// #####################################

const PORT = process.env.PORT || 8003
app.listen(PORT, () => {
  console.log(`authentication_service listening on port ${PORT}!`)
})
