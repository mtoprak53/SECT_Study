class Node {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinarySearchTree {
  constructor(root = null) {
    this.root = root;
  }

  /** insert(val): insert a new node into the BST with value val.
   * Returns the tree. Uses iteration. */

  insert(val) {
    let current = this.root;
    const newNode = new Node(val);

    if (!current) {
      this.root = newNode;
      return this;
    }

    while (current) {
      if (val < current.val) {
        if(!current.left) {
          current.left = newNode;
          return this;
        }
        else current = current.left;
      }
      else {
        if(!current.right) {
          current.right = newNode;
          return this;
        }
        else current = current.right;
      }
    }
  }

  /** insertRecursively(val): insert a new node into the BST with value val.
   * Returns the tree. Uses recursion. */

  insertRecursively(val) {

    function insertRecursivelyHelper(node, val) {
      if (!node) return new Node(val);

      val < node.val
      ? node.left =insertRecursivelyHelper(node.left, val)
      : node.right = insertRecursivelyHelper(node.right, val);
      return node;
    }

    this.root = insertRecursivelyHelper(this.root, val);
    return this;
  }

  /** find(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses iteration. */

  find(val) {
    let current = this.root;
    while (current) {      
      if (!current) return;
      if (val === current.val) return current;

      current = val < current.val 
                ? current.left 
                : current.right;
    }
  }

  /** findRecursively(val): search the tree for a node with value val.
   * return the node, if found; else undefined. Uses recursion. */

  findRecursively(val) {

    function findRecursivelyHelper(node, val) {
      if (!node) return; 
      if (val === node.val) return node;

      return val < node.val 
             ? findRecursivelyHelper(node.left, val)
             : findRecursivelyHelper(node.right, val);
    }

    return findRecursivelyHelper(this.root, val);
  }

  /** dfsPreOrder(): Traverse the array using pre-order DFS.
   * Return an array of visited nodes. */

  dfsPreOrder() {
    function dfsPreOrderHelper(node, arr=[]) {
      arr.push(node.val);
      if (node.left) dfsPreOrderHelper(node.left, arr);
      if (node.right) dfsPreOrderHelper(node.right, arr);
      return arr;
    }

    return dfsPreOrderHelper(this.root);
  }

  /** dfsInOrder(): Traverse the array using in-order DFS.
   * Return an array of visited nodes. */

  dfsInOrder() {
    function dfsInOrderHelper(node, arr=[]) {
      if (node.left) dfsInOrderHelper(node.left, arr);
      arr.push(node.val);
      if (node.right) dfsInOrderHelper(node.right, arr);
      return arr;
    }

    return dfsInOrderHelper(this.root);
  }

  /** dfsPostOrder(): Traverse the array using post-order DFS.
   * Return an array of visited nodes. */

  dfsPostOrder() {
    function dfsPostOrderHelper(node, arr=[]) {
      if (node.left) dfsPostOrderHelper(node.left, arr);
      if (node.right) dfsPostOrderHelper(node.right, arr);
      arr.push(node.val);
      return arr;
    }

    return dfsPostOrderHelper(this.root);
  }

  /** bfs(): Traverse the array using BFS.
   * Return an array of visited nodes. */

  bfs() {
    function bfsHelper(node, arr=[]) {
      let queue = [node];

      while(queue.length) {
        let current = queue.shift();
        arr.push(current.val);
        if (current.left) queue.push(current.left);
        if (current.right) queue.push(current.right);
      }
      return arr;
    }

    return bfsHelper(this.root);
  }

  /** Further Study!
   * remove(val): Removes a node in the BST with the value val.
   * Returns the removed node. */

  remove(val) {

  }

  /** Further Study!
   * isBalanced(): Returns true if the BST is balanced, false otherwise. */

  isBalanced() {

  }

  /** Further Study!
   * findSecondHighest(): Find the second highest value in the BST, if it exists.
   * Otherwise return undefined. */

  findSecondHighest() {
    
  }
}

module.exports = BinarySearchTree;
