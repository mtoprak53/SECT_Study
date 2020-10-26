// console.log("Let's get this party started!");

const gifDiv = document.querySelector('#gif-div');
const searchTerm = document.querySelector("#search-term");

async function addGif() {
  const res = await axios.get(`http://api.giphy.com/v1/gifs/search?q=${searchTerm.value}&api_key=MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym`);
  const arrLength = res.data.data.length;
  const idx = Math.floor(Math.random() * arrLength);
  const gifId = res.data.data[idx].id;
  makeNewImg(gifId);
}

function makeNewImg(gifId) {
  const gifUrl = `https://i.giphy.com/${gifId}.gif`;
  const newDiv = document.createElement("DIV");
  const newGif = document.createElement("IMG");
  newDiv.classList.add("m-2");
  newGif.src = gifUrl;
  newDiv.append(newGif);
  gifDiv.append(newDiv);
}

const searchBtn = document.querySelector('#search-button')
searchBtn.addEventListener('click', addGif);

const removeBtn = document.querySelector('#remove-button');
removeBtn.addEventListener('click', function() {
  const imgs = document.querySelectorAll('.m-2');
  for (let img of imgs) {
    img.remove();
  }
});




