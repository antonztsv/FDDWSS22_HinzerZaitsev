import { useState, useEffect, useContext } from "react"
import { useNavigate, Outlet } from "react-router-dom"

import { UserContext } from "../context/UserContext"

import Layout from "../components/styled/Layout"
import Container from "../components/styled/Container"
import Title from "../components/styled/Title"
import { saveToStorage } from "../helpers/saveToStorage"
import { fetchToken } from "../helpers/fetchToken"

const URL = "http://localhost:8000/api/game"

const Dashbaord = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)

  async function handleNewGame(token) {
    console.log("new game")
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`, // notice the Bearer before your token
      },
    })
    const data = await response.json()
    console.log(data)
    saveToStorage("gameId", data.id)

    user.gameId = data.id
    setUser({ ...user })
    console.log(user)
    navigate(user.gameId ? `/game/${user.gameId}` : "/")
  }

  return (
    <Layout>
      <Container>
        <Title>User: {user.name}</Title>
        <p>{user.id}</p>
        <button onClick={() => console.log(user.id ? user : user)}>Get State</button>
        <button onClick={() => (localStorage.clear(), navigate("/", { replace: true }))}>Clear localStorage</button>
        <button onClick={() => handleNewGame(user.token)}>new Game</button>
      </Container>
    </Layout>
  )
}

export default Dashbaord
