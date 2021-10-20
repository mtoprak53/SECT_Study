/** Node: node for a singly linked list. */

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

/** LinkedList: chained together nodes. */

class LinkedList {
  constructor(vals = []) {
    this.head = null;
    this.tail = null;
    this.length = 0;

    for (let val of vals) this.push(val);
  }

  /** push(val): add new value to end of list. */

  push(val) {
    const newNode = new Node(val);

    // if LL is empty
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    }
    else{
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  /** unshift(val): add new value to start of list. */

  unshift(val) {
    const newNode = new Node(val);

    // if LL is empty
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    }

    const exHead = this.head;
    this.head = newNode;
    this.head.next = exHead;
    this.length++;
  }

  /** pop(): return & remove last item. */

  pop() {
    // if LL is an empty list
    if (this.length === 0) throw new Error("Empty Linked List!!");
    
    let currentNode = this.head;

    // if LL has only one item
    if (this.length === 1) {
      this.head = null;
      this.tail = null;
      this.length = 0;
      return currentNode.val;
    }

    // if LL has two or more items
    const exTail = this.tail;
    let newTail;
    while(currentNode.next !== null) {
      newTail = currentNode;
      currentNode = currentNode.next;
    }
    newTail.next = null;
    this.tail = newTail;
    this.length--;
    
    return exTail.val;
  }

  /** shift(): return & remove first item. */

  shift() {

    // if LL is an empty list
    if (this.length === 0) throw new Error("Empty Linked List!!");
    
    let currentNode = this.head;

    // if LL has only one item
    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } 

    // if LL has two or more items
    else {
      this.head = currentNode.next;
    }

    this.length--;
    return currentNode.val;
  }

  /** getAt(idx): get val at idx. */

  getAt(idx) {
    // invalid index
    if (idx >= this.length) throw new Error("Invalid index!");

    let currentNode = this.head;

    let i = 0;
    while (i < idx) {
      currentNode = currentNode.next;
      i++;
    }
    return currentNode.val;
  }

  /** setAt(idx, val): set val at idx to val */

  setAt(idx, val) {

    // invalid index
    if (idx >= this.length) throw new Error("Invalid index!");

    let currentNode = this.head;

    let i = 0;
    while (i < idx) {
      currentNode = currentNode.next;
      i++;
    }
    currentNode.val = val;
  }

  /** insertAt(idx, val): add node w/val before idx. */

  insertAt(idx, val) {

    // invalid index
    if (idx > this.length) throw new Error("Invalid index!");

    const newNode = new Node(val);
    const currentNode = this.head;

    // if LL is an empty list
    if (this.length === 0) {
      this.head = newNode;
      this.tail = newNode;
      this.length++;
      return;
    }

    if (idx === 0) {
      this.head = newNode;
      newNode.next = currentNode;
      this.length++;
      return;
    }

    if (idx === this.length) {
      const exTail = this.tail
      this.tail = newNode;   
      exTail.next = newNode;
      this.length++;
      return;
    }
    
    let previousNode;
    let nextNode = currentNode;
    let i = 0;
    while (i < idx) {
      previousNode = nextNode;
      nextNode = previousNode.next;
      i++;
    }

    previousNode.next = newNode;
    newNode.next = nextNode;
    this.length++;
  }

  /** removeAt(idx): return & remove item at idx, */

  removeAt(idx) {

    // invalid index
    if (idx >= this.length || idx < 0) {
      throw new Error("Invalid index!");
    }

    const currentNode = this.head;

    if (idx === 0) {
      this.head = (this.length === 1) ? null : this.head.next;
      this.tail = (this.length === 1) ? null : this.tail;
      this.length--;
      return currentNode.val;
    }
    
    let previousNode;
    let i = 0;
    while (i < idx) {
      previousNode = currentNode;
      currentNode = currentNode.next;
      i++;
    }

    // if it is the tail
    if (idx === this.length - 1) {
      this.tail = previousNode;   
      previousNode.next = null;
    }
    else {
      previousNode.next = currentNode.next;
    }

    this.length--;
    return currentNode.val;
  }

  /** average(): return an average of all values in the list */

  average() {
    // empty list
    if (this.length === 0) return 0;

    let currentNode = this.head;
    let valSum = currentNode.val;
    while (currentNode.next) {
      currentNode = currentNode.next;
      valSum += currentNode.val;
    }
    return valSum / this.length;
  }
}

module.exports = LinkedList;
