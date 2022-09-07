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
const queue = exchange.queue({ name: "task_queue", durable: true })
const unpublishedMessages = []

// check if rabbitmq is connected
rabbit.on("connected", () => {
  console.log("[AMQP] RabbitMQ connection established")

  // consume messages from queue
  queue.consume((data, ack) => {
    console.log(
      "[AMQP] Message received from " + data.service + ": ",
      data.message
    )
    ack()
  })
})

rabbit.on("reconnected", () => {
  console.log("[AMQP] RabbitMQ connection re-established")

  // publish unpublished messages
  unpublishedMessages.forEach((message) => {
    console.log("[AMQP] Publishing offline message")
    publishMessage(message)
  })

  queue.consume((data, ack) => {
    console.log(
      "[AMQP] Message received from " + data.service + ": ",
      data.message
    )
    ack()
  })
})

const publishMessage = (message) => {
  // check  if rabbitmq is connected
  if (rabbit.isConnectionReady()) {
    console.log("[AMQP] Publishing message", message)
    exchange.publish(message, { key: "task_queue" })
  } else {
    console.log("[AMQP] RabbitMQ not connected, saving message for later")
    unpublishedMessages.push(message)
  }
}

// express routes
// #####################################

app.get("/", (req, res) => {
  publishMessage({
    service: "authentication_service",
    message: "Hello from authentication_service",
  })

  res.send("authentication_service")
})

// express server start
// #####################################

const PORT = process.env.PORT || 8003
app.listen(PORT, () => {
  console.log(`authentication_service listening on port ${PORT}!`)
})
