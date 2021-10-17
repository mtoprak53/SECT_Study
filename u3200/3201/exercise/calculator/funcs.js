
function mean(arr) {
  const adder = (accu, curr) => accu + curr;
  return arr.reduce(adder, 0) / arr.length;
}

function median(arr) {
  arr.sort((a, b) => a - b);
  if (arr.length % 2 === 1) {
    const idx = (arr.length - 1) / 2;
    return arr[idx];
  } else { 
    const idx = arr.length / 2;
    return (arr[idx] + arr[idx-1]) / 2;
  }
}

function mode(arr) {
  const hashmap = arr.reduce((acc, val) => {
    acc[val]= (acc[val] || 0) + 1;
    return acc
  }, {})
  // console.log(hashmap);
  let res, isUnique, resArr = [], maxFreq = 0;
  for (num in hashmap) {
    // frequency of num
    // +hashmap[num]  -->  string to number
    const hNum = parseInt(hashmap[num]);

    // if num's freq is larger the current max freq
    if (hNum > maxFreq) {
      res = parseInt(num); // make the num most freq
      maxFreq = hNum; // make num's freq max freq
      isUnique = true;  // currently there is only one most freq number
      resArr = []; // if there has been an array of most freq numbers till now empty the array

      // if num's freq is equal to the current max freq
    } else if (hNum === maxFreq) {

      // if there was only one number with max freq before num
      if (isUnique) {
        resArr.push(res);  // put that number in the array
        isUnique = false;  // now there are more than one most freq numbers
        res = null; // make the only most freq number variable null
      };      
      resArr.push(parseInt(num)); // add num to the most freq numbers array
    }    
  }

  const set1 = new Set(arr);
  const set2 = new Set(resArr);
  // console.log(set1);
  // console.log(set2);

  // if all numbers are most freq
  if (set1.size === set2.size) {
    // console.log(hashmap);
    // console.log(set1);
    // console.log(set2);
    return null  // there is no mode than
  };
  if (isUnique) return res;  // if there is only one most freq number
  return resArr;  // if there are more than one most freq numbers

  // return Object.keys(hashmap).reduce((a, b) => {
  //   hashmap[a] > hashmap[b] ? a : b;
  // });  
}

module.exports = { mean, median, mode }