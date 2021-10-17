function countZeroes(arr) {
  let leftIdx = 0;
  let rightIdx = arr.length - 1;

  if (arr[leftIdx] === 0) return arr.length;
  if (arr[rightIdx] === 1) return 0;

  while (rightIdx - leftIdx > 1) {
    let middleIdx = Math.floor((leftIdx + rightIdx) / 2);
    
    if (arr[middleIdx] === 1) {
      leftIdx = middleIdx;
    } else {
      rightIdx = middleIdx;
    }
  }
  return arr.length - rightIdx;
}

module.exports = countZeroes