/** BinaryTreeNode: node for a general tree. */

class BinaryTreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  /** minDepth(): return the minimum depth of the tree -- that is,
   * the length of the shortest path from the root to a leaf. */

  minDepth() {
    const stack = [[this.root, 1]];
    let minDepth = Infinity, current, node, step;
    const root = this.root;
    let leftPath = root && root.left !== null;
    let rightPath = root && root.right !== null;
    
    if (leftPath || rightPath) {
      while(stack.length) {
        current = stack.pop();
        node = current[0];
        step = current[1];
        leftPath = node && node.left !== null;
        rightPath = node && node.right !== null;
        if (!leftPath && !rightPath && step < minDepth) {
          minDepth = step;
        }
        if (leftPath) stack.push([node.left, step + 1]);
        if (rightPath) stack.push([node.right, step + 1]);
      }
      return minDepth;
    }
    else return 0;
  }

  /** maxDepth(): return the maximum depth of the tree -- that is,
   * the length of the longest path from the root to a leaf. */

  maxDepth() {
    const stack = [[this.root, 1]];
    let maxDepth = 0, current, node, step;
    const root = this.root;
    let leftPath = root && root.left !== null;
    let rightPath = root && root.right !== null;
    
    if (leftPath || rightPath) {
      while(stack.length) {
        current = stack.pop();
        node = current[0];
        step = current[1];
        leftPath = node && node.left !== null;
        rightPath = node && node.right !== null;
        if (!leftPath && !rightPath && step > maxDepth) {
          maxDepth = step;
        }
        if (leftPath) stack.push([node.left, step + 1]);
        if (rightPath) stack.push([node.right, step + 1]);
      }
      return maxDepth;
    }
    else return 0;
  }

  /** maxSum(): return the maximum sum you can obtain by traveling along a path in the tree.
   * The path doesn't need to start at the root, but you can't visit a node more than once. */

  maxSum() {
    const root = this.root;
    let maxDepth = 0;
    if (root === null) return 0;
    const stack = [[root, '0']];
    const dic = {'0': root.val} ;
    let current, node, code;
    let leftPath = root && root.left !== null;
    let rightPath = root && root.right !== null;
    
    if (leftPath || rightPath) {
      while(stack.length) {
        current = stack.pop();
        node = current[0];
        code = current[1];
        leftPath = node && node.left !== null;
        rightPath = node && node.right !== null;
        if (!leftPath && !rightPath && code.length > maxDepth) {
          maxDepth = code.length;
        }
        if (leftPath) {
          stack.push([node.left, code + '0']);
          dic[code + '0'] = node.left.val;
        }
        if (rightPath) {
          stack.push([node.right, code + '1']);
          dic[code + '1'] = node.right.val;
        }
      }
    }
    
    let depth = maxDepth, maxSum = 0;
    while (depth > 1) {
      let depthArr = Object.keys(dic).filter(v => v.length === depth);

      while (depthArr.length) {
        let nodeBinary = depthArr.pop();
        let nodeValue = dic[nodeBinary];

        let parentBinary = nodeBinary.slice(0, depth - 1);
        let parentValue = dic[parentBinary];

        let lastDigit = nodeBinary[depth-1] === '0' ? '1' : '0';
        let siblingBinary = parentBinary + lastDigit;
        let hasSibling = depthArr.includes(siblingBinary);        
        let siblingValue = hasSibling ? dic[siblingBinary] : 0;

        if (depth === maxDepth) {
          if (nodeValue < 0) nodeValue = 0;
          if (siblingValue < 0) siblingValue = 0;
        }

        let parentPathSum = nodeValue + siblingValue + parentValue;
        if (parentPathSum > maxSum) {
          maxSum = parentPathSum;
        }
        dic[parentBinary] += Math.max(nodeValue, siblingValue);
        
        delete dic[nodeBinary];
        delete dic[siblingBinary];
        depthArr = Object.keys(dic).filter(v => v.length === depth);
      }

      depth--;
    }
    return maxSum;

  }

  /** nextLarger(lowerBound): return the smallest value in the tree
   * which is larger than lowerBound. Return null if no such value exists. */

  nextLarger(lowerBound) {
    const stack = [this.root];
    let nextLarger = null;
    const root = this.root;
    if (root === null) return null;
    let leftPath = root && root.left !== null;
    let rightPath = root && root.right !== null;
    
    if (leftPath || rightPath) {
      while(stack.length) {
        let node = stack.pop();
        leftPath = node && node.left !== null;
        rightPath = node && node.right !== null;
        if (lowerBound < node.val && (node.val < nextLarger || nextLarger === null)) {
          nextLarger = node.val;
        }
        if (leftPath) stack.push(node.left);
        if (rightPath) stack.push(node.right);
      }
    }
    else {
      node = stack.pop();
      if (lowerBound < node.val && node.val < nextLarger) {
        nextLarger = node.val;
      }      
    }
    return nextLarger;

  }

  /** Further study!
   * areCousins(node1, node2): determine whether two nodes are cousins
   * (i.e. are at the same level but have different parents. ) */

  areCousins(node1, node2) {

  }

  /** Further study!
   * serialize(tree): serialize the BinaryTree object tree into a string. */

  static serialize() {

  }

  /** Further study!
   * deserialize(stringTree): deserialize stringTree into a BinaryTree object. */

  static deserialize() {

  }

  /** Further study!
   * lowestCommonAncestor(node1, node2): find the lowest common ancestor
   * of two nodes in a binary tree. */

  lowestCommonAncestor(node1, node2) {
    
  }
}

module.exports = { BinaryTree, BinaryTreeNode };
