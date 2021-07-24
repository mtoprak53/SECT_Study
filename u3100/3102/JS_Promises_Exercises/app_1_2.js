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