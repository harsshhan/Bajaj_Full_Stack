
const isValidEdge = (edge) => {
  if (typeof edge !== "string") return false;

  const trimmed = edge.trim();

  if (!/^[A-Z]->[A-Z]$/.test(trimmed)) return false;

  const [parent, child] = trimmed.split("->");

  if (parent === child) return false;

  return true;
};

const processGraph = (data) => {
  const invalid_entries = [];
  const duplicate_edges = [];

  const seenEdges = new Set();  
  const validEdges = [];

  for (let edge of data) {
    const trimmed = typeof edge === "string" ? edge.trim() : edge;

    if (!isValidEdge(trimmed)) {
      invalid_entries.push(edge);
      continue;
    }

    if (seenEdges.has(trimmed)) {
      if (!duplicate_edges.includes(trimmed)) {
        duplicate_edges.push(trimmed);
      }
      continue;
    }

    seenEdges.add(trimmed);
    validEdges.push(trimmed);
  }

  const adjList = {};    
  const parentMap = {};  
  const nodes = new Set();

  for (let edge of validEdges) {
    const [parent, child] = edge.split("->");

    nodes.add(parent);
    nodes.add(child);
    if (parentMap[child]) continue;

    parentMap[child] = parent;

    if (!adjList[parent]) adjList[parent] = [];
    adjList[parent].push(child);
  }

  const visited = new Set();
  const hierarchies = [];

  let total_trees = 0;
  let total_cycles = 0;
  let largest_tree_root = "";
  let maxDepth = 0;

  const detectCycle = (node, visiting) => {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;

    visiting.add(node);

    for (let child of adjList[node] || []) {
      if (detectCycle(child, visiting)) return true;
    }

    visiting.delete(node);
    visited.add(node);
    return false;
  };

  const buildTree = (node) => {
    const obj = {};
    obj[node] = {};

    for (let child of adjList[node] || []) {
      Object.assign(obj[node], buildTree(child));
    }

    return obj;
  };

  const getDepth = (node) => {
    if (!adjList[node] || adjList[node].length === 0) return 1;

    let max = 0;
    for (let child of adjList[node]) {
      max = Math.max(max, getDepth(child));
    }

    return max + 1;
  };

 
  const childrenSet = new Set(Object.keys(parentMap));
  const roots = [];

  for (let node of nodes) {
    if (!childrenSet.has(node)) {
      roots.push(node);
    }
  }

  const processedNodes = new Set();

  const processComponent = (start) => {
    const stack = [start];
    const componentNodes = new Set();

    while (stack.length) {
      const curr = stack.pop();
      if (componentNodes.has(curr)) continue;

      componentNodes.add(curr);

      for (let child of adjList[curr] || []) {
        stack.push(child);
      }
    }

    let hasCycle = false;
    const visiting = new Set();

    for (let node of componentNodes) {
      if (detectCycle(node, visiting)) {
        hasCycle = true;
        break;
      }
    }
    componentNodes.forEach(n => processedNodes.add(n));

    if (hasCycle) {
      total_cycles++;

      return {
        root: start,
        tree: {},
        has_cycle: true
      };
    } else {
      total_trees++;

      const tree = buildTree(start);
      const depth = getDepth(start);

      if (
        depth > maxDepth ||
        (depth === maxDepth && start < largest_tree_root)
      ) {
        maxDepth = depth;
        largest_tree_root = start;
      }

      return {
        root: start,
        tree,
        depth
      };
    }
  };

  for (let root of roots.sort()) {
    if (!processedNodes.has(root)) {
      hierarchies.push(processComponent(root));
    }
  }

  for (let node of nodes) {
    if (!processedNodes.has(node)) {
      total_cycles++;

      hierarchies.push({
        root: node,
        tree: {},
        has_cycle: true
      });

      processedNodes.add(node);
    }
  }

  return {
    user_id: "Harshan_09032006",        
    email_id: "ha8020@srmist.edu.in",
    college_roll_number: "RA2311026010086", 
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root
    }
  };
};

module.exports = { processGraph };