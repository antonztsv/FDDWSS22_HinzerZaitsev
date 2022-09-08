import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"
import { nanoid } from "nanoid"

import { createServer } from "http"
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"

import jackrabbit from "@pager/jackrabbit"

// socket.io setup
// #####################################

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
  },
})

// admin ui
instrument(io, {
  auth: false,
})

// express middleware
// #####################################

app.use(cors())
app.use(express.json())

// amqp (rabbitmq) event handling
// #####################################

const rabbit = jackrabbit(process.env.AMQP_URL)
const exchange = rabbit.default()
const queue = exchange.queue({ name: "task_queue", durable: false })
const unpublishedMessages = []

rabbit.on("connected", () => {
  console.log("[AMQP] RabbitMQ connection established")

  consumeMessages()
})

rabbit.on("reconnected", () => {
  console.log("[AMQP] RabbitMQ connection re-established")

  if (unpublishedMessages.length > 0) {
    unpublishedMessages.forEach((message) => {
      console.log("[AMQP] Publishing offline message")
      publishMessage(message)
    })
    unpublishedMessages.length = 0
  }

  consumeMessages()
})

const consumeMessages = () => {
  queue.consume((message, ack, nack) => {
    // ADD EVENTS
    if (message.event === "playerToken") {
      console.log("[AMQP] Message received", message)

      ack()
      return
    }
    nack()
    return
  })
}

const publishMessage = (message) => {
  if (rabbit.isConnectionReady()) {
    console.log("[AMQP] Publishing message", message)
    exchange.publish(message, { key: "task_queue" })
  } else {
    console.log("[AMQP] RabbitMQ not connected, saving message for later")
    unpublishedMessages.push(message)
  }
}

// data
// #####################################

const players = []

class Player {
  constructor(name) {
    this.id = nanoid(5)
    this.name = name
  }
}

// express routes
// #####################################

app.get("/", (req, res) => {
  publishMessage({
    event: "newPlayer",
    payload: { id: "12345", name: "John" },
  })

  res.send("player_service")
})

app.post("/api/player", (req, res) => {
  const name = req.body.name || "Anonymous"

  const player = new Player(name)
  players.push(player)

  res.json(player)
})

// express server start
// #####################################

const PORT = process.env.PORT || 8001
app.listen(PORT, () => {
  console.log(`player_service listening on port ${PORT}!`)
})

// socket.io events
// #####################################

io.on("connection", (socket) => {
  console.log("Client connected: " + socket.id)

  socket.on("ping", () => {
    console.log("ping received")
    socket.emit("pong", "player_service")
  })
})
