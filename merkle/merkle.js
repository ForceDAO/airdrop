const ethers = require("ethers");
const data = require("./data");
const { addIndexToLeaves, writeToFileSystem } = require("./helpers");

const hash = (leaf) => {
  return ethers.utils.id(JSON.stringify(leaf));
};

const reduceMerkleBranches = (leaves, hash1) => {
  let output = [];
  let i = 0;
  const adjacentHashIndex = leaves.indexOf(hash1);
  while (leaves.length) {
    i++;
    let left = leaves.shift();
    let right = leaves.length === 0 ? left : leaves.shift();
    output.push(hash(left + right));
  }
  const nextLevelIndex = Math.floor(adjacentHashIndex / 2);
  let nextAdjacentHash =
    nextLevelIndex % 2 === 0
      ? output[nextLevelIndex + 1]
      : output[nextLevelIndex - 1];
  return { nextLevel: output, returnedNextHash: nextAdjacentHash };
};

const firstHashing = (leaves, leafIndex) => {
  let hashedLeaves = [];
  let adjacentHash;
  const sisterHashPosition =
    leafIndex % 2 === 0 ? leafIndex + 1 : leafIndex - 1;
  for (i = 0; leaves.length > i; i++) {
    const hashedLeaf = hash(leaves[i]);
    if (i === sisterHashPosition) {
      adjacentHash = hashedLeaf;
    }
    hashedLeaves.push(hashedLeaf);
  }
  return { firstLevel: hashedLeaves, adjacentHash };
};

const powerOf2Check = (n) => {
  const isPowerOf2 = n && (n & (n - 1)) === 0;
  if (!isPowerOf2) {
    throw new Error("hey wait no stop");
  }
};

const computeRoot = (initialLeaves, i) => {
  let root = [];
  let nextHash = [];
  const leaves = initialLeaves;
  const leaf = leaves[i];
  const leafIndex = i;

  let { firstLevel, adjacentHash } = firstHashing(leaves, leafIndex);
  const firstHash = adjacentHash;
  root.push(...firstLevel);
  while (root.length > 1) {
    const { nextLevel, returnedNextHash } = reduceMerkleBranches(
      root,
      adjacentHash
    );
    if (returnedNextHash) {
      nextHash.push(returnedNextHash);
      adjacentHash = returnedNextHash;
    }
    root.push(...nextLevel);
    nextHash.unshift(firstHash);
  }
  if (root && !i) {
	writeToFileSystem(JSON.stringify({root: root[0]}), "root")
  }
  return {nextHash, leaf};
};

const merlkeTree = () => {
  const leaves = addIndexToLeaves(data);
  let i = 0
  let proofs = []
  while (leaves.length > i) {
	const newLeaves = leaves
	const proof = computeRoot(newLeaves, i);
	proofs.push(proof)
	i++
  }
  writeToFileSystem(JSON.stringify(proofs), "proofs")
};

merlkeTree();
