import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { UserContext } from "../context/UserContext"

const Game = (props) => {
  const { user, setUser } = useContext(UserContext)

  return (
    <div>
      <h1>My Game: {user.gameId}</h1>
    </div>
  )
}

export default Game
