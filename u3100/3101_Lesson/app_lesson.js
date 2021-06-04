
// let planet;
// const url = "https://swapi.dev/api/planets/1/";

// $.getJSON(url, response => {
//     planet = response;
//     console.log(planet);  // working
//     $.getJSON(planet.residents[0], response => {
//         resident = response;
//         console.log(resident);  // working
//     });
// });

// console.log(planet);  // undefined


// #########################################################

// // WORKING URL
// const url = "https://swapi.dev/api/planets/1/";

// // REJECT EXAMPLE 
// const url = "https://swapi.dev/api/lkadhsjkfhakdsjfh";

// let ourFirstPromise = axios.get(url);
// console.log("REQUEST HAS BEEN SENT!!");

// // console.log(ourFirstPromise);

// // .then()
// // ourFirstPromise.then(() => console.log("RESOLVED!!!"));
// // ourFirstPromise.then(data => console.log(data));
// ourFirstPromise.then(res => console.log(res.data));

// // .catch()
// // ourFirstPromise.catch(() => console.log("REJECTED!!!"));
// ourFirstPromise.catch(err => console.log("REJECTED!!!", err));

// console.log("I AM THE LAST LINE!!");


// #########################################################
// PROMISE CHAINING

// NO CHAIN
// const url = "https://swapi.dev/api/planets/1/";
// axios.get(url)
//     .then(res => {
//         console.log(res)
//         axios.get(res.data.residents[0])
//         .then(res => {
//             console.log(res)
//         })
//         .catch(err => {
//             console.log("ERRRORRROROROROROR", err)
//         })
//     })
//     .catch(err => console.log("REJECTED!!!", err));


// WITH CHAIN
// const url = "https://swapi.dev/api/planets/1/";
// axios.get(url)
//     .then(res => {
//         console.log("FIRST RESPONSE RESOLVED!");
//         console.log(res.data);
//         return axios.get(res.data.residents[0])
//         // return axios.get('sdfsdfssdgb')   // FAIL EXAMPLE
//     })
//     .then(res => {
//         console.log("SECOND RESPONSE RESOLVED!");
//         console.log(res.data);
//         return axios.get(res.data.films[0])
//     })
//     .then(res => {
//         console.log("THIRD RESPONSE RESOLVED!");
//         console.log(res.data);
//     })
//     .catch(err => console.log("REJECTED!!!", err));


// #########################################################
// REFACTORING CALLBACK HELL

const baseURL = "https://pokeapi.co/api/v2/pokemon";

// // NO PROMISES
// $.ajax(`${baseURL}/1/`, {
//   success: p1 => {
//     console.log(`The first pokenmon is ${p1.name}`);
//     $.ajax(`${baseURL}/2/`, {
//       success: p2 => {
//         console.log(`The second pokenmon is ${p2.name}`);
//         $.ajax(`${baseURL}/3/`, {
//           success: p3 => {
//             console.log(`The third pokenmon is ${p3.name}`);
//           },
//           error: err => console.log(err)
//         });
//       },
//       error: err => console.log(err)
//     });
//   },
//   error: err => console.log(err)
// });


// YES PROMISES
axios
  .get(`${baseURL}/1/`)
  .then(p1 => {
    console.log(`The first pokemon is ${p1.data.name}`);
    return axios.get(`${baseURL}/2/`);
  })
  .then(p2 => {
    console.log(`The second pokemon is ${p2.data.name}`);
    return axios.get(`${baseURL}/3/`);
  })
  .then(p3 => {
    console.log(`The third pokemon is ${p3.data.name}`);
  })
  .catch(err => {
    console.log(`Oops, there was a problem :( ${err})`);
  });



// #########################################################
// WRITING PROMISES

// function wait3Seconds() {
//   return new Promise((resolve, reject) => {
//     // resolve();
//     // reject();
//     // setTimeout(resolve, 3000);
//     setTimeout(() => {
//       reject()
//     }, 3000);
//   });
// }


// wait3Seconds()
//   .then(() => console.log("ALL DONE!"))
//   .catch(() => console.log("ERROR!"));

// console.log("STILL WAITING");


const h1 = document.querySelector('h1');

// setTimeout(function () {
//   h1.style.color = 'red';
//   setTimeout(() => {
//     h1.style.color = 'blue';
//     setTimeout(() => {
//       h1.style.color = 'green';
//       setTimeout(() => {
//         h1.style.color = 'purple';
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);


function changeColor(el, color) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      el.style.color = color;
      resolve();
    }, 1000);
  });
}

// changeColor(h1, 'red')
//   .then(() => {
//     changeColor(h1, 'blue')
//   })


changeColor(h1, 'red')
  .then(() => changeColor(h1, 'ornage'))
  .then(() => changeColor(h1, 'yellow'))
  .then(() => changeColor(h1, 'green'))
  .then(() => changeColor(h1, 'blue'))
  .then(() => changeColor(h1, 'indigo'))
  .then(() => changeColor(h1, 'violet'))


// #########################################################
// Mock AJAX Promise

// // one time hard coded promise
// let mockAjaxRequest = new Promise(function (resolve, reject) {
//   let probSuccess = 0.5;
//   let requestTime = 1000;

//   // We mock a network request using a setTimeout.
//   // The request takes requestTime milliseconds.
//   // Afterwards, the promise is either resolved with data
//   // or rejected with a timeout message,
//   // based on whether randomNum is less than probSuccess.
//   setTimeout(function () {
//     let randomNum = Math.random();
//     if (randomNum < probSuccess) {
//       let data = "here's your data!";
//       resolve(data);
//     } else {
//       reject("Sorry, your request failed.");
//     }
//   }, requestTime);
// });

// mockAjaxRequest
//   .then(data => {
//     console.log(data);
//     return mockAjaxRequest
//   })
//   .then(data => {
//     console.log(data);
//   })
//   .catch(err => console.log(err));

// new promise each time
function mockAjaxRequest() {
  return new Promise(function (resolve, reject) {
    let probSuccess = 0.5;
    let requestTime = 1000;
  
    // We mock a network request using a setTimeout.
    // The request takes requestTime milliseconds.
    // Afterwards, the promise is either resolved with data
    // or rejected with a timeout message,
    // based on whether randomNum is less than probSuccess.
    setTimeout(function () {
      let randomNum = Math.random();
      if (randomNum < probSuccess) {
        let data = "here's your data!";
        resolve(data);
      } else {
        reject("Sorry, your request failed.");
      }
    }, requestTime);
  });
}

mockAjaxRequest()
  .then(data => {
    console.log(data);
    return mockAjaxRequest()
  })
  .then(data => {
    console.log(data);
  })
  .catch(err => console.log(err));


// #########################################################
// RECREATING AXIOS

// OUR AXIOS
function get(url) {
  const request = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    request.onload = function () {
      if (request.readyState !== 4) return;
    
      // Check status code
      if (request.status >= 200 && request.status < 300) {
        // console.log("IT WORKED!", request)
        // resolve(JSON.parse(request.response))
        resolve({
          data: JSON.parse(request.response),
          status: request.status,
          request: request,
          // headers: request.getAllResponseHeaders()
        })
      } else {
        // console.log("ERROR!!")
        // reject(request.status)
        reject({
          msg: 'Server Error',
          status: request.status,
          request: request
        })
      }
    }
    request.onerror = function handleError() {
      // console.log("NETWORK ERROR!")
      request = null;
      // reject('NETWORK ERROR!');
      reject({
        msg: "NETWORK ERROR!"
      })
    }
    request.open('GET', url);
    request.send();
  })
}

const baseUrl1 = "https://swapi.dev/api/planets/1/";
const baseUrl2 = "https://swapi.dev/api/planets/2/";
const baseUrl3 = "https://pokeapi.co/api/v2/pokemon/3";

get(baseUrl1)
  .then(res => {
    console.log(res);
    return get(baseUrl2)
  })
  .then(res => console.log(res))
  .catch(err => console.log(err));



// // #########################################################
// // PROMISE ALL

// const fourPokemonPromises = [];
// const baseUrl = "https://pokeapi.co/api/v2/pokemon"

// for (let i=1; i<5; i++) {
//   fourPokemonPromises.push(
//     axios.get(`${baseUrl}/${i}`)
//   );
// }

// // error
// // fourPokemonPromises.push(axios.get("agkdghjskjfgkysgf"));

// Promise.all(fourPokemonPromises)
//   .then(pokemonArr => {
//     // pokemonArr.forEach(p => console.log(p.name))
//     // console.log(pokemonArr)
//     for (res of pokemonArr) {
//       console.log(res.data.name)
//     }
//   })
//   .catch(err => console.log(err));



// #########################################################
// PROMISE RACE

const fourPokemonPromises = [];
const baseUrl = "https://pokeapi.co/api/v2/pokemon"

for (let i=1; i<5; i++) {
  fourPokemonPromises.push(
    axios.get(`${baseUrl}/${i}`)
  );
}

Promise.race(fourPokemonPromises  )
  .then(res => {
    console.log(`${res.data.name} won the race.`)
  })
  .catch(err => console.log(err));




// #########################################################
// 



// #########################################################
// 



// #########################################################
// 





















