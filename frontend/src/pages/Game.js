import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"
import io from "socket.io-client"

import Layout from "../components/styled/Layout"
import Container from "../components/styled/Container"

const gameSocket = io(`http://localhost:8000`)

const Game = (props) => {
  const { user, setUser } = useContext(UserContext)

  // game_service

  const [room, setRoom] = useState("")
  const [message, setMessage] = useState("")
  const [messageReceived, setmessageReceived] = useState("")

  const sendPing = () => {
    gameSocket.emit("ping", "pingggg")
  }

  const sendMessage = () => {
    gameSocket.emit("send_message", { message })
  }

  const sendMessageRoom = () => {
    gameSocket.emit("send_message_room", { message, room })
  }

  const joinRoom = () => {
    if (room !== "") {
      gameSocket.emit("join_room", room, (message) => {
        console.log(message)
      })
    }
  }

  useEffect(() => {
    gameSocket.on("receive_message", (data) => {
      setmessageReceived(data.message)
    })
    gameSocket.on("receive_message_room", (data) => {
      setmessageReceived(data.message)
    })
    // return () => {
    //   cleanup
    // }
  }, [gameSocket])

  return (
    <Layout>
      <Container>
        <h1>My Game: {user.gameId}</h1>
      </Container>
      <Container>
        <button onClick={() => sendPing()}>Ping</button>
      </Container>
    </Layout>
  )
}

export default Game
