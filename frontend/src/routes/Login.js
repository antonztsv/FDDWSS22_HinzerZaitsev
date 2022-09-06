import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"

import Layout from "../components/styled/Layout"
import Title from "../components/styled/Title"
import Form from "../components/styled/Form"

import { fetchPOST } from "../helpers/fetchData.js"

import { UserContext } from "../context/UserContext"

const Login = () => {
  const navigate = useNavigate()
  const url = "http://localhost:8001/api/player"

  const [name, setName] = useState("")
  const { user, setUser } = useContext(UserContext)

  async function submitHandler(e) {
    e.preventDefault()
    const body = {
      name,
    }
    const data = await fetchPOST(url, body)
    console.log(data)
    setUser(data)
    // navigate(`/game/${data.id}`)
  }

  return (
    <Layout>
      <Title>Name: {name}</Title>
      <Form onSubmit={submitHandler}>
        <label>
          <input
            type="text"
            required
            name={`Username`}
            value={name}
            placeholder="Nickname"
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </Form>
      <h2>{user ? JSON.stringify(user, null, 2) : ""}</h2>
    </Layout>
  )
}

export default Login
