import { useState, useEffect, useContext } from "react"

import { UserContext } from "../context/UserContext"

import Layout from "../components/styled/Layout"
import Title from "../components/styled/Title"

import { fetchToken } from "../helpers/fetchToken"

const URL = "http://localhost:8001/api/player"
const Dashbaord = () => {
  const { user, setUser } = useContext(UserContext)

  return (
    <Layout>
      <Title>User: </Title>
      <p>{user}</p>
      {/* <button onClick></button> */}
      <button onClick={fetchToken(URL, user)}>Fetch Token</button>
    </Layout>
  )
}

export default Dashbaord
