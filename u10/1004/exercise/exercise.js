/** filter out the odd numbers */

function filterOutOdds(...nums) {
  return nums.filter(nums => nums % 2 === 0)
}

// filterOutOdds(1,2,3,4,5,6,7,8,9);


/** find the minimum number */

function findMin(...nums) {
  return nums.reduce((acc, val) => val < acc ? val : acc);
}

// findMin(1,4,12,-3);


/** merge the objects */

function mergeObjects(obj1, obj2) {
  return {...obj1, ...obj2}
}

// mergeObjects({a:1, b:2}, {c:3, d:4});


/** double and return the arguments */

function doubleAndReturnArgs(arr, ...nums) {
  nums = nums.map(num => num * 2);
  return [...arr, ...nums];
}

// doubleAndReturnArgs([1,2,3],4,4); // [1,2,3,8,8]
// doubleAndReturnArgs([2],10,4); // [2, 20, 8]


/** SLICE & DICE */

/** remove a random element in the items array
and return a new array without that item. */

function removeRandom(items) {
  let idx = Math.floor(Math.random() * items.length);
  items.splice(idx,1);
  return items;
}

// removeRandom([1,2,3,4,5,6,7,8]);


/** Return a new array with every item in array1 and array2. */

function extend(array1, array2) {
  return [...array1, ...array2];
}

// extend( [1, 2, 3], ['a', 'b', 'c'] );


/** Return a new object with all the keys and values
from obj and a new key/value pair */

function addKeyVal(obj, key, val) {
  let obj2 = {};
  obj2[key] = val;
  return {...obj, ...obj2};
}

// addKeyVal({'key1': 'ab', 'key2': 'yz'}, 'keyXtra', 'valXtra');


/** Return a new object with a key removed. */

function removeKey(obj, key) {
  const keysArr = Object.keys(obj).filter(k => k !== key);
  const newObj = {};
  keysArr.forEach(k => newObj[k] = obj[k]);
  return newObj;
}

// removeKey({'key1': 'ab', 'key2': 'yz', 'key3': 'pi'}, 'key3');


/** Combine two objects and return a new object. */

function combine(obj1, obj2) {
  return {...obj1, ...obj2}
}

// combine({'k1': 'v1', 'k2': 'v2'}, {'k3': 'v3', 'k4': 'v4'});


/** Return a new object with a modified key and value. */

function update(obj, key, val) {
  obj[key] = val;
  return obj
}

// update({'k1': 'v1', 'k2': 'v2', 'k3': 'v3'}, 'k4', 'v4');

