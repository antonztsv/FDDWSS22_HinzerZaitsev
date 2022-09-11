import React from "react"
import Layout from "../components/styled/Layout"
import Container from "../components/styled/Container"
function handleShufflePile() {
  console.log("shuffle pile")
}

function handleDrawCard(amount) {
  // draw ${amount} card from DRAW PILE
  console.log("draw card")
}

function handlePlaceCard() {
  // place one card to the DISCARD PILE
  console.log("place card")
}

function handleCheckHand() {
  //
}

const RunningGame = (props) => {
  return (
    <Layout>
      {props.children}
      <Container></Container>
    </Layout>
  )
}

export default RunningGame
