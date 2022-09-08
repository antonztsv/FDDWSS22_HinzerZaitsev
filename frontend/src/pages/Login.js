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

  // const token = localStorage.getItem('token')

  // const response = await fetch(apiURL, {
  //         method: 'POST',
  //         headers: {
  //             'Content-type': 'application/json',
  //             'Authorization': `Bearer ${token}`, // notice the Bearer before your token
  //         },
  //         body: JSON.stringify(yourNewData)
  //     })

  async function submitHandler(e) {
    e.preventDefault()
    const body = {
      name,
    }
    const data = await fetchPOST(url, body)

    window.localStorage.setItem("jwtToken", data)
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
      <h2>{user ? JSON.stringify(user, null, 2) : null}</h2>
    </Layout>
  )
}

export default Login
