import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Context } from "../context/Context"
import io from "socket.io-client"

import Layout from "../components/styled/Layout"
import Container from "../components/styled/Container"
import RunningGame from "./RunningGame"
import GameLobby from "./GameLobby"

// const socket = io.connect(`http://localhost:8000`, { query: `token=OlUJn` })
const socket = io.connect(`http://localhost:8000`)
// let socket

const Game = () => {
  const navigate = useNavigate()
  const { user, setUser, game, setGame } = useContext(Context)
  const [deck, setDeck] = useState([])

  function handleLeaveGame() {
    console.log("leave_game")
    socket.emit("leave_game", game.id)
    setGame({ id: "", joined: false, started: false, players: [""] })
    navigate("/")
  }

  function handleStartGame() {
    console.log("start_game")
    socket.emit("start_game", game.id)
  }

  useEffect(() => {
    socket.io.opts.query = `token=${localStorage.getItem("token")}`
    socket.connect()

    socket.emit("join_game", game.id)

    socket.on("player_joined", (players) => {
      console.log("player_joined")
      console.log(players)
      game.players = players
      setGame({ ...game })
    })

    socket.on("player_left", (players) => {
      console.log("player_left")
      console.log(players)
      game.players = players
      setGame({ ...game })
    })

    socket.on("disconnect_from_socket", (players) => {
      console.log("disconnect_from_socket")
      game.players = players
      setGame({ ...game })
    })

    socket.on("game_started", (data) => {
      console.log("game_started")
      game.started = data.started
      setDeck(data.deck)
      setGame({ ...game })
    })

    socket.on("disconnect", () => {
      console.log("disconnect")
      handleLeaveGame()
    })

    return () => {
      console.log("unmounted")
      socket.off("player_joined")
      socket.off("player_left")
      socket.off("game_started")
      handleLeaveGame()
    }
  }, [socket])

  return (
    <>
      {game.started ? (
        <RunningGame>
          <Container>
            <h1>Running Game</h1>
          </Container>
          <button onClick={() => console.log("Deck: ", deck)}>Get Deck</button>
        </RunningGame>
      ) : (
        <GameLobby>
          <Container>
            <h1>My Game: {game.id}</h1>
            <h2>Me: {user.name}</h2>
          </Container>
          <Container>
            <button onClick={handleStartGame}>Start Game</button>
            <button onClick={handleLeaveGame}>Leave Game</button>
          </Container>
          <Container>
            <h2>Players:</h2>
            {game.players.map((value, index) => (
              <p key={index}>{value.name}</p>
            ))}
          </Container>
        </GameLobby>
      )}
    </>
  )
}

export default Game
