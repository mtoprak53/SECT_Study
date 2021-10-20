/** Node: node for a stack. */

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

/** Stack: chained-together nodes where you can
 *  remove from the top or add to the top. */

class Stack {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  /** push(val): add new value to end of the stack. Returns undefined. */

  // CORRECTION: on the "TOP" of the stack

  push(val) {
    const newNode = new Node(val);
    if (this.size) {
      newNode.next = this.first;
    }
    else {
      this.last = newNode;
    }
    this.first = newNode;
    this.size++;
  }

  /** pop(): remove the node from the top of the stack
   * and return its value. Should throw an error if the stack is empty. */

  pop() {

    // empty queue
    if (!this.size) {
      throw new Error("The queue is empty!");
    }

    const val = this.first.val;
    if (this.size === 1) {
      this.last = null;
      this.first = null;
    }
    else {
      this.first = this.first.next
    }
    this.size--;
    return val;
  }

  /** peek(): return the value of the first node in the stack. */

  peek() {

    // empty queue
    if (!this.size) {
      throw new Error("The queue is empty!");
    }

    const val = this.first.val;
    return val;
  }

  /** isEmpty(): return true if the stack is empty, otherwise false */

  isEmpty() {
    return !this.size;
  }
}

module.exports = Stack;
