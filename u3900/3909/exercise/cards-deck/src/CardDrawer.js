import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import "./CardDrawer.css"

const CardDrawer = () => {
  /** URL parts */
  const BASE_URL = "https://deckofcardsapi.com/api/deck";
  const NEW_DECK = "new/shuffle/?deck_count=1";
  const DRAW_CARD = "draw/?count=1";

  /** STATES */
  const INITIAL_STATE = [];
  const [cards, setCards] = useState(INITIAL_STATE);
  const [deckId, setDeckId] = useState(null);
  
  /** Get a shuffled deck and set its id only when the app starts */
  useEffect(() => {
    async function shuffleDeck() {
      const resDeck = await axios.get(`${BASE_URL}/${NEW_DECK}`);
      setDeckId(resDeck.data.deck_id);
    }
    shuffleDeck();
  }, []);

  /** Draw a card and add it into the drawed cards array */
  async function drawCard() {
    if (cards.length === 52) {
      alert("Error: no cards remaining!");
      return;
    }
    else{
      const res = await axios.get(`${BASE_URL}/${deckId}/${DRAW_CARD}`);
      const { image } = res.data.cards[0];
      const tilt = Math.floor(Math.random() * 90)-45;
      setCards(cards => [ ...cards, { image, tilt } ]);
    }
  }

  /** Render */
  return (
    <div className="CardDrawer">
      <h3>Remaining Cards: {52 - cards.length}</h3>
      <button onClick={drawCard}>Draw Card</button>
      <div className="CardDrawer-card-container">
        {cards.map(({ image, tilt }) => <Card image={image} tilt={tilt} />)}
      </div>
    </div>
  )
}

export default CardDrawer;