import { utils } from "ethers";
const data = require("./data")

const hash = (leaf) => {
	return utils.id(
    utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint256"],
      [leaf.index, leaf.address, leaf.amount]
    )
  );
}

const reduceMerkleBranches = (leaves, hash1) => {
    let output = [];
    let i = 0;
    const adjacentHashIndex = leaves.indexOf(hash1)
    console.log({nodes: leaves})
    while (leaves.length) {
        i += 1
        let left = leaves.shift()
        let right = (leaves.length === 0) ? left: leaves.shift();
        output.push(hash(left + right)) 
    }
    const nextLevelIndex = Math.floor(adjacentHashIndex / 2) 
    let nextAdjacentHash = nextLevelIndex % 2 === 0 ?  output[nextLevelIndex + 1] : output[nextLevelIndex - 1]
    return {nextLevel: output, returnedNextHash: nextAdjacentHash}

}

const firstHashing = (leaves, leafIndex) => {
    let hashedLeaves = []
    let adjacentHash
    const sisterHashPosition = leafIndex % 2 === 0 ? leafIndex + 1 : leafIndex - 1 
        for(let i = 0; leaves.length > i; i += 1) {
            const hashedLeaf =  hash(leaves[i])
            if (i === sisterHashPosition) {
                adjacentHash = hashedLeaf
            }
            hashedLeaves.push(hashedLeaf)
        }
        return {firstLevel: hashedLeaves, adjacentHash}  
} 

const sortAndAddIndex = (balances) => {
  balances.sort(function (a, b) {
    const al = a.address.toLowerCase();
    const bl = b.address.toLowerCase();
    if (al < bl) {
      return -1;
    }
    if (al > bl) {
      return 1;
    }
    return 0;
  });

  return balances.map(function (a, i) {
    return { address: a, balance: balances[a], index: i };
  });
}


const computeRoot = () => {
    let root = []
	let nextHash = []
	const leaves = sortAndAddIndex(data);
    const leaf = leaves[0]
	console.log({leaves})
    const leafIndex = leaves.indexOf(leaf)


    let {firstLevel, adjacentHash} =  firstHashing(leaves, leafIndex)
    const firstHash = adjacentHash
    root.push(...firstLevel)
    while (root.length > 1) {
        const {nextLevel, returnedNextHash} =  reduceMerkleBranches(root, adjacentHash)
        if (returnedNextHash) {
            nextHash.push(returnedNextHash)
            adjacentHash = returnedNextHash
        }
        root.push(...nextLevel)
	}
	nextHash.unshift(firstHash)
    console.log("proof", {nextHash, root: root[0], leaf})
    console.log({root})

}

computeRoot()
