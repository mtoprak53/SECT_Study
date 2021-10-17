function findFloor(arr, val) {
  let leftIdx = 0;
  let rightIdx = arr.length - 1;
  let middleIdx;

  // edge cases
  if (arr[leftIdx] > val) return -1;
  if (arr[rightIdx] <= val) return arr[rightIdx];

  while(leftIdx <= rightIdx ) {
    middleIdx = Math.floor((leftIdx + rightIdx) / 2);

    if (arr[middleIdx] > val) {
      rightIdx = middleIdx - 1;
    }
    else if (arr[middleIdx] < val) {
      leftIdx = middleIdx + 1;
    }
    else {
      return arr[middleIdx];
    }
  }
  return arr[middleIdx-1];
}

module.exports = findFloor