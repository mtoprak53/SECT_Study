


// 1.1

const URL = "http://numbersapi.com";
let myFavoriteNumber = 53;
const div = document.getElementById("ex-1");

let myPromise = axios.get(`${URL}/${myFavoriteNumber}?json`);

myPromise
  .then(res => {
    console.log(res.data);
    div.classList.toggle("hidden");
  })
  .catch(err => console.log(err));


// ###########################

// 1.2

const URL = "http://numbersapi.com";
const list = document.getElementById("numbers-facts");
const div = document.getElementById("ex-2");

numbers = "4,6,9..12";
let multiNumbersPromise = axios.get(`${URL}/${numbers}`)

multiNumbersPromise
  .then(res => {
    console.log(res.data);
    div.classList.toggle("hidden");
    for (key in res.data) {
      let newLi = document.createElement("li");
      newLi.innerText = res.data[key];
      list.append(newLi);
    }
  })
  .catch(err => console.log(err));


// ###########################

// 1.3

const URL = "http://numbersapi.com";
let myFavoriteNumber = 53;
const div = document.getElementById("ex-3");
const list = document.getElementById("number-facts");

function multiPromises() {
  return axios.get(`${URL}/${myFavoriteNumber}?json`)
}

function writeList(res) {
  console.log(res.data);
  let newLi = document.createElement("li");
  newLi.innerText = res.data.text;
  list.append(newLi);
}

multiPromises()
  .then(res => {
    div.classList.toggle("hidden");
    writeList(res);
    return multiPromises()
  })
  .then(res => {
    writeList(res);    
    return multiPromises()
  })
  .then(res => {
    writeList(res);
    return multiPromises()
  })
  .then(res => writeList(res))
  .catch(err => console.log(err));

