/** Node: node for a queue. */

class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

/** Queue: chained-together nodes where you can
 *  remove from the front or add to the back. */

class Queue {
  constructor() {
    this.first = null;
    this.last = null;
    this.size = 0;
  }

  /** enqueue(val): add new value to end of the queue. Returns undefined. */

  enqueue(val) {
    const newNode = new Node(val);
    if (this.size) {
      this.last.next = newNode;
    }
    else {
      this.first = newNode;
    }
    this.last = newNode;
    this.size++;
  }

  /** dequeue(): remove the node from the start of the queue
   * and return its value. Should throw an error if the queue is empty. */

  dequeue() {

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
      this.first = this.first.next;
    }
    this.size--;
    return val;
  }

  /** peek(): return the value of the first node in the queue. */

  peek() {

    // empty queue
    if (!this.size) {
      throw new Error("The queue is empty!");
    }

    const val = this.first.val;
    return val;
  }

  /** isEmpty(): return true if the queue is empty, otherwise false */

  isEmpty() {
    return !this.size;
  }
}

module.exports = Queue;
