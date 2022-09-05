import express from "express"
import amqplib from "amqplib"

const app = express()

const PORT = process.env.PORT || 8002

app.use(express.json())

// TODO: AMQP (RabbitMQ) connection

app.get("/", (req, res) => {
  res.send("rule_service")
})

app.listen(PORT, () => {
  console.log(`rule_service listening on port ${PORT}!`)
})
