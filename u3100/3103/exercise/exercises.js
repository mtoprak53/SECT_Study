
// ####################################################

// PART 1: NUMBER FACTS
// ###################

// 1)

const URL = "http://numbersapi.com";

async function getFact(favNum) {
  const res = await axios.get(`${URL}/${favNum}?json`);
  console.log(res.data.text);
}

getFact(3);


// ###################

// 2)

const URL = "http://numbersapi.com";
const list = document.getElementById("numbers-facts");
const div = document.getElementById("ex-2");
let nums = "4,6,9..12";


async function getMultiFacts(nums) {
  const res = await axios.get(`${URL}/${nums}`);
  console.log(res.data);
  div.classList.toggle("hidden");
  for (key in res.data) {
    let newLi = document.createElement("li");
    newLi.innerText = res.data[key];
    list.append(newLi);
  }
}

getMultiFacts(nums);


// ###################

// 3)

const URL = "http://numbersapi.com";
const div = document.getElementById("ex-3");
const list = document.getElementById("number-facts");

async function sameNumFacts(favNum, repeatNum) {
  const Promises = [];
  const Responses = [];
  for (i = 0; i < repeatNum; i++) {
    Promises.push(axios.get(`${URL}/${favNum}`));
  }
  for (i = 0; i < repeatNum; i++) {
    Responses.push(await Promises[i]);
  }

  div.classList.toggle("hidden");

  for (i = 0; i < repeatNum; i++) {
    let newLi = document.createElement("li");
    newLi.innerText = Responses[i].data;
    list.append(newLi);
  }
}

sameNumFacts(6,12);


// ####################################################

// PART 2: DECK OF CARDS
// ###################

// 1)

const cardDiv = document.getElementById("card-image");
const div = document.getElementById("ex-2-1");

const URL = "https://deckofcardsapi.com/api/deck";
let deckId, card, cardImage;

async function shuffleNDraw() {
  const res = await axios.get(`${URL}/new/shuffle/?deck_count=1`);
  deckId = res.data.deck_id;

  const res2 = await axios.get(`${URL}/${deckId}/draw/?count=1`);
  const value = res2.data.cards[0].value;
  const suit = res2.data.cards[0].suit;
  console.log(`The card you drawn is ${value} of ${suit.toLowerCase()}.`);

  div.classList.toggle("hidden");
  cardImage = res2.data.cards[0].image;

  newImg = document.createElement("img");
  newImg.setAttribute("src", `${cardImage}`);
  cardDiv.append(newImg);  
}

shuffleNDraw();


// ###################

// 2)

const cardDiv = document.getElementById("card-images");
const div = document.getElementById("ex-2-2");

const URL = "https://deckofcardsapi.com/api/deck";
let deckId, card, cardImage1, cardImage2, newImg1, newImg2;

async function shuffleNDoubleDraw() {
  const res0 = await axios.get(`${URL}/new/shuffle/?deck_count=1`);
  deckId = res0.data.deck_id;

  const res1 = await axios.get(`${URL}/${deckId}/draw/?count=1`);
  const res2 = await axios.get(`${URL}/${deckId}/draw/?count=1`);
  const value1 = res1.data.cards[0].value;
  const suit1 = res1.data.cards[0].suit;
  console.log(`The card you firstly drawn is ${value1} of ${suit1.toLowerCase()}.`);

  const value2 = res2.data.cards[0].value;
  const suit2 = res2.data.cards[0].suit;
  console.log(`The card you secondly drawn is ${value2} of ${suit2.toLowerCase()}.`);

  div.classList.toggle("hidden");

  cardImage1 = res1.data.cards[0].image;
  cardImage2 = res2.data.cards[0].image;
  newImg1 = document.createElement("img");
  newImg1.setAttribute("src", `${cardImage1}`);
  cardDiv.append(newImg1);
  newImg2 = document.createElement("img");
  newImg2.setAttribute("src", `${cardImage2}`);
  cardDiv.append(newImg2);
}

shuffleNDoubleDraw();


// ###################

// 3)

// HTML ELEMENTS
const div = document.getElementById("ex-2-3");
div.classList.toggle("hidden");
const cardsDiv = document.getElementById("drawn-card");
const cardsLeft = document.getElementById("left-cards");
const bttn = document.querySelector("button");

// VARIABLES
const URL = "https://deckofcardsapi.com/api/deck";
let deckId, remaining = 52;
cardsLeft.innerText = remaining;

// FUNCTIONS

function buildHtml(res) {
  // CONSOLE LOGS
  console.log(res.data);
  const card = res.data.cards[0];
  const cardName = `${card.value} of ${card.suit}`;
  console.log(cardName);

  // CARD IMAGE
  const newImg = document.createElement("img");
  newImg.setAttribute("src", `${card.image}`);
  const tilt = (Math.random() * 90) - 45;
  newImg.style.transform = `rotate(${tilt}deg)`;
  cardsDiv.append(newImg);

  // REMAINING CARD COUNTER
  remaining = res.data.remaining;
  cardsLeft.innerText = remaining;
}

async function cardDraw() {
  // FIRST CARD OF THE DECK
  if (!(deckId || remaining < 52)) {
    const res0 = await axios.get(`${URL}/new/shuffle/?deck_count=1`);
    deckId = res0.data.deck_id;
  }

  // AFTER THE FIRST CARD DRAWN
  const res = await axios.get(`${URL}/${deckId}/draw/?count=1`);
  buildHtml(res);  
}

// EVENTLISTENER FOR THE BUTTON
bttn.addEventListener("click", cardDraw);

