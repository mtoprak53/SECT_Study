function merge(arr1, arr2) {
  let i = 0;
  let j = 0;
  const result = [];

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      result.push(arr1[i]);
      i++;
    } else {
      result.push(arr2[j]);
      j++;
    }
  }
  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {

  if(arr.length > 1) {
    let midIdx = Math.floor(arr.length / 2);
    return merge(
      mergeSort(arr.slice(0, midIdx)), 
      mergeSort(arr.slice(midIdx))
    );
  }
  if(arr.length > 0) return merge([arr[0]], [])
  return merge([], []);
  // console.log("ARR:", arr);
}

module.exports = { merge, mergeSort};