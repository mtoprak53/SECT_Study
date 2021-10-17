
function findRotatedIndex(arr, val) {

  let leftIdx = 0;
  let rightIdx = arr.length - 1;
  let middleIdx, middleVal;
  let cond1, cond2, condA, condB, condX, condY, condBig, condL, condR;

  // edge cases
  if (arr[leftIdx] === val) return leftIdx;
  if (arr[rightIdx] === val) return rightIdx;

  while(leftIdx <= rightIdx ) {

    middleIdx = Math.floor((leftIdx + rightIdx) / 2);
    middleVal = arr[middleIdx];

    cond1 = val >= arr[leftIdx];
    cond2 = val <= arr[rightIdx];
    condA = middleVal < val;
    condB = middleVal > val;
    condX = middleVal >= arr[leftIdx];
    condY = middleVal <= arr[rightIdx];

    condBig = (condB && condX) || (condA && condY);

    condL = (cond1 && condA && condX) || (cond2 && condBig);      
    condR = (cond2 && condB && condY) || (cond1 && condBig);
    
    if (middleVal === val) {
      return middleIdx;
    }
    else if (condL) {
      leftIdx = middleIdx + 1;
    }
    else if (condR) {
      rightIdx = middleIdx - 1;
    }
  }
  return -1; 
}

module.exports = findRotatedIndex