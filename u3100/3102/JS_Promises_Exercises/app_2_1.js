// 2.1

const URL = "https://deckofcardsapi.com/api/deck";

// decks  ->  # of decks shuffled (number)
function shuffleCards(decks) {
  return axios.get(`${URL}/new/shuffle/?deck_count=${decks}`)
}

// cards  ->  # of cards drawn (number)
function drawCards(cards, deckId) {
  return axios.get(`${URL}/${deckId}/draw/?count=${cards}`)
}

shuffleCards(decks=1)
  .then(res => {
    const deckId = res.data.deck_id;
    console.log(deckId);
    return drawCards(cards=1, deckId)
  })
  .then(res => {
    const suit = res.data.cards[0].suit;
    const value = res.data.cards[0].value;
    console.log(`${value} of ${suit}`);
  })
  .catch(err => console.log(err));
