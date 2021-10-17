
function sortedFrequency(arr, val) {
  let leftIdx = 0;
  let rightIdx = arr.length - 1;
  let leftVal = arr[leftIdx];
  let rightVal = arr[rightIdx];

  let middleIdx, middleVal;
    
  // return -1 if val is less than smallest item
  // or larger than greatest item
  if (leftVal > val || rightVal < val) return -1;

  while (leftIdx <= rightIdx) {
    middleIdx = Math.floor((leftIdx + rightIdx) / 2);
    middleVal = arr[middleIdx];

    // if it hits the val
    if (middleVal === val) {

      let middleLeftIdx = middleIdx;
      let middleRightIdx = middleIdx;
      let leftPointIdx, leftPointVal, rightPointIdx, rightPointVal;

      // left part search
      while (leftIdx <= middleLeftIdx) {
        leftPointIdx = Math.floor((leftIdx + middleLeftIdx) / 2);
        leftPointVal = arr[leftPointIdx];

        if (leftPointVal < val) {
          leftIdx = leftPointIdx + 1;
        } else {
          middleLeftIdx = leftPointIdx - 1;
        }
      }

      // right part search
      while (middleRightIdx <= rightIdx) {
        rightPointIdx = Math.floor((rightIdx + middleRightIdx) / 2);
        rightPointVal = arr[rightPointIdx];

        if (rightPointVal > val) {
          rightIdx = rightPointIdx - 1;
        } else {
          middleRightIdx = rightPointIdx + 1
        }
      }

      return rightIdx - leftIdx + 1;
    }

    // if it hits larger
    if (middleVal > val) {
      rightIdx = middleIdx - 1;
    } 

    // if it hits smaller
    if (middleVal < val) {
      leftIdx = middleIdx + 1;
    }
  }

  return -1;
}


module.exports = sortedFrequency;