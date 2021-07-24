// 1.3

let myFavoriteNumber = 44;

const URL = "http://numbersapi.com";
const div = document.getElementById("ex-3");const list = document.getElementById("number-facts");

const span = document.getElementById("favorite-number-2");
span.innerText = myFavoriteNumber;

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