function findRotationCount(arr) {
  let leftIdx = 0;
  let rightIdx = arr.length - 1;
  let middleIdx;

  // edge case
  if (arr[leftIdx] < arr[rightIdx]) return 0;

  while(leftIdx <= rightIdx ) {
    middleIdx = Math.floor((leftIdx + rightIdx) / 2);

    if (arr[middleIdx] < arr[middleIdx-1]) {
      return middleIdx;
    }
    else if (arr[leftIdx] <= arr[middleIdx]) {
      leftIdx = middleIdx + 1;
    }
    else if (arr[middleIdx] <= arr[rightIdx]) {
      rightIdx = middleIdx - 1;
    }
  }
}

module.exports = findRotationCount