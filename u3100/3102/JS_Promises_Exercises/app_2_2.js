// 2.2

const URL = "https://deckofcardsapi.com/api/deck";

// decks  ->  # of decks shuffled (number)
function shuffleCards(decks) {
  return axios.get(`${URL}/new/shuffle/?deck_count=${decks}`)
}

// cards  ->  # of cards drawn (number)
function drawCards(cards, deckId) {
  return axios.get(`${URL}/${deckId}/draw/?count=${cards}`)
}

const cardsList = [];

shuffleCards(decks=1)
  .then(res => {
    const deckId = res.data.deck_id;
    // console.log(deckId);
    return drawCards(cards=1, deckId)
  })
  .then(res => {
    const deckId = res.data.deck_id;
    // console.log(deckId);
    const suit1 = res.data.cards[0].suit;
    const value1 = res.data.cards[0].value;
    const card1 = `${value1} of ${suit1}`;
    cardsList.push(card1);
    return drawCards(cards=1, deckId)
  })
  .then(res => {
    // const deckId = res.data.deck_id;
    // console.log(deckId);
    const suit2 = res.data.cards[0].suit;
    const value2 = res.data.cards[0].value;
    const card2 = `${value2} of ${suit2}`;
    cardsList.push(card2);
    console.log(cardsList[0]);
    console.log(cardsList[1]);
  })
  .catch(err => console.log(err));
