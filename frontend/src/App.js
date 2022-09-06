import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import { useState, useEffect, useContext } from "react"

import "./styles/App.css"

import { UserContext } from "./context/UserContext"

import Login from "./routes/Login"
import Dashbaord from "./routes/Dashbaord"

import AllGames from "./routes/AllGames"
import Game from "./routes/Game"
import NotFound from "./routes/NotFound"

function App() {
  const [user, setUser] = useState(null)

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" element={<Login />} />
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
