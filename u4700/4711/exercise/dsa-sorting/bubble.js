function bubbleSort(arr) {
  let count = 0;
  for(let i = 0; i < arr.length; i++) {
    let swapped = false;
    for(let j = 0; j < arr.length - i; j++) {
      count++;
      if(arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;
      }
    }
    if(!swapped) break;
  }
  // console.log("TOTAL COUNT:", count);
  return arr;
}

module.exports = bubbleSort;