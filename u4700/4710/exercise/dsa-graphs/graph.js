class Node {
  constructor(value, adjacent = new Set()) {
    this.value = value;
    this.adjacent = adjacent;
  }
}

class Graph {
  constructor() {
    this.nodes = new Set();
  }

  // this function accepts a Node instance and adds it to the nodes property on the graph
  addVertex(vertex) {
    this.nodes.add(vertex);
  }

  // this function accepts an array of Node instances and adds them to the nodes property on the graph
  addVertices(vertexArray) {
    for(let vertex of vertexArray) {
      this.addVertex(vertex);
    }
  }

  // this function accepts two vertices and updates their adjacent values to include the other vertex
  addEdge(v1, v2) {
    v1.adjacent.add(v2);
    v2.adjacent.add(v1);
  }

  // this function accepts two vertices and updates their adjacent values to remove the other vertex
  removeEdge(v1, v2) {
    v1.adjacent.delete(v2);
    v2.adjacent.delete(v1);
  }

  // this function accepts a vertex and removes it from the nodes property, it also updates any adjacency lists that include that vertex
  removeVertex(vertex) {
    this.nodes.delete(vertex);
    for(let node of this.nodes) {
      // console.log(vertex.value);
      // console.log(node.value);
      // console.log(vertex.value, node.value);
      if(node.adjacent.has(vertex)) {
        node.adjacent.delete(vertex);
      }
    }
  }

  // this function returns an array of Node values using DFS
  depthFirstSearch(start) {
    let toVisitStack = [start];
    let seen = new Set(toVisitStack);
    let output = [];
    while(toVisitStack.length) {
      // console.log(toVisitStack.map((node) => node.value));

      let currNode = toVisitStack.pop();
      // console.log("DFS Visiting:", currNode.value);

      output.push(currNode.value);

      for(let neighbor of currNode.adjacent) {
        if(!seen.has(neighbor)) {
          toVisitStack.push(neighbor);
          seen.add(neighbor);
        }
      }
    }
    return output;
  }

  // this function returns an array of Node values using BFS
  breadthFirstSearch(start) {
    let toVisitQueue = [start];
    let seen = new Set(toVisitQueue);
    let output = [];
    while(toVisitQueue.length) {
      // console.log(toVisitStack.map((node) => node.value));

      let currNode = toVisitQueue.shift();
      // console.log("DFS Visiting:", currNode.value);

      output.push(currNode.value);

      for(let neighbor of currNode.adjacent) {
        if(!seen.has(neighbor)) {
          toVisitQueue.push(neighbor);
          seen.add(neighbor);
        }
      }
    }
    return output;}
}

module.exports = {Graph, Node}