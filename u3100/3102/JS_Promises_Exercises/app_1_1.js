// 1.1

const URL = "http://numbersapi.com";
let myFavoriteNumber = 53;
const div = document.getElementById("ex-1");const list = document.getElementById("number-fact");

const span = document.getElementById("favorite-number");
span.innerText = myFavoriteNumber;

function writeList(res) {
  console.log(res.data);
  let newLi = document.createElement("li");
  newLi.innerText = res.data.text;
  list.append(newLi);
}

let myPromise = axios.get(`${URL}/${myFavoriteNumber}?json`);

myPromise
  .then(res => {
    div.classList.toggle("hidden");
    writeList(res);
  })
  .catch(err => console.log(err));