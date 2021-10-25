/** product: calculate the product of an array of numbers. */

function product(nums) {
  while (nums.length > 0) {
    return nums.pop() * product(nums);
  }
  return 1;
}


/** longest: return the length of the longest word in an array of words. */

function longest(words) {
  // if empty array return 0 
  if (!words.length) return 0;

  // if one item array return its length
  if (words.length === 1) return words[0].length;

  // if first item is shorter delete it 
  // otherwise delete other
  let pos = (words[0].length <= words[1].length) ? 0 : 1;
  words.splice(pos,1);

  // call the function for shortened array
  return longest(words);
}


/** everyOther: return a string with every other letter. */

function everyOther(str) {
  if(!str.length) return '';
  if(str.length === 1) return str[0];
  return str[0] + everyOther(str.slice(2));
}

/** isPalindrome: checks whether a string is a palindrome or not. */

function isPalindrome(str) {
  const len = str.length;
  if (len < 2) return true;
  if (str[0] !== str[len - 1]) return false;
  return isPalindrome(str.slice(1, len - 1));
}


/** findIndex: return the index of val in arr (or -1 if val is not present). */

function findIndex(arr, val) {
  if (!arr.includes(val)) return -1;
  if (arr[0] === val) return 0;
  return 1 + findIndex(arr.slice(1), val);
}


/** revString: return a copy of a string, but in reverse. */

function revString(str) {
  let len = str.length;
  if (len < 2) return str;
  return str[len - 1] + revString(str.slice(1, len - 1)) + str[0];
}

/** gatherStrings: given an object, return an array of all of the string values. */

function gatherStrings(obj) {
  for (key in obj) {
    let val = obj[key];
    delete obj[key];
    if (typeof val === "object") {
      return gatherStrings({...obj, ...val});
    }
    if (typeof val === "string") {
      return [val, ...gatherStrings(obj)];
    }
  }
  return [];
}


/** binarySearch: given a sorted array of numbers, and a value,
 * return the index of that value (or -1 if val is not present). */

function binarySearch(arr, val) {
  let mid = Math.floor(arr.length -1);
  if (arr[mid] === val) return mid;
  if (arr[mid] < val) {
    return binarySearch(arr.slice(mid + 1), val);
  }
  if (arr[mid] > val) {
    return binarySearch(arr.slice(0, mid), val);
  }
  return -1;
}

module.exports = {
  product,
  longest,
  everyOther,
  isPalindrome,
  findIndex,
  revString,
  gatherStrings,
  binarySearch
};
