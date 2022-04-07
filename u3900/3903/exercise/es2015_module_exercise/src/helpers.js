import React from "react";

const choice = (items) => items[Math.floor(Math.random() * items.length)];

// const choice = (items) => {
//   const idx = Math.floor(Math.random() * items.length);
//   return items[idx];
// };

const remove = (items, item) => {
  for(let i = 0; i < items.length; i++) {
    if(items[i] === item) return items.splice(i, 1);
  }
}

// items.map((i, idx, items) => {
//   if(i === item) {
//     items.splice(idx,1);
//     return item;
//   };
//   return;
// });

export {choice, remove };