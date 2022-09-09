import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { useState, useEffect, useContext } from "react"

import "./styles/App.css"

import { UserContext } from "./context/UserContext"
import { getFromStorage } from "./helpers/saveToStorage"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"

import AllGames from "./pages/AllGames"
import Game from "./pages/Game"
import NotFound from "./pages/NotFound"

const URL = "http://localhost:8001/api/player"

function App() {
  const [user, setUser] = useState({ name: "", token: "", id: "" })

  useEffect(() => {
    user.token = getFromStorage("token")
    user.name = getFromStorage("name")
    user.id = getFromStorage("id")
    setUser({ ...user })
  }, [])

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" element={user.id ? <Dashboard /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game">
            <Route index element={<AllGames />} />
            <Route path=":id" element={<Game />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
