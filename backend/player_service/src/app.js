import * as dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()
import cors from "cors"
import { nanoid } from "nanoid"

import { createServer } from "http"
import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui"

import jwt from "jsonwebtoken"

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
  res.send("player_service")
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1800s" })
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]

  const token = authHeader && authHeader.split(" ")[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

app.post("/api/player", (req, res) => {
  const name = req.body.name || "Anonymous"

  const player = new Player(name)
  players.push(player)

  const token = generateAccessToken({ player })
  res.json(token)
})

app.get("/api/player", authenticateToken, (req, res) => {
  res.json(players)
  // res.send("Show Players")
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
