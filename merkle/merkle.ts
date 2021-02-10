import { utils, BigNumber } from "ethers";
import { writeToFileSystem } from "./helpers";
const data = require("./data");

export const hash = (leaf): string => {
  return utils.keccak256(
    utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint256"],
      [BigNumber.from(leaf.index), leaf.address, BigNumber.from(leaf.amount)]
    )
  );
};

const reduceMerkleBranches = (leaves: string[]) => {
  let output = [];
  while (leaves.length) {
    let left = leaves.shift();
    let right = leaves.length === 0 ? left : leaves.shift();
    output.push(
      utils.keccak256(
        utils.defaultAbiCoder.encode(["bytes32", "bytes32"], [left, right])
      )
    );
  }
  return output;
};

const computeMerkleProof = (wholeTree: any, index: number) => {
  let hashedLeaves = wholeTree//sortAndAddIndex(balances);
  if (index == null) {
    throw new Error("address not found");
  }
  let path: number = index;
  let proof = [];
  let i = 0
  while (i < hashedLeaves.length) {
    if (path % 2 == 1) {
      proof.push(hashedLeaves[i][path - 1]);
    } else {
      if (hashedLeaves[i][path + 1]) {
        proof.push(hashedLeaves[i][path + 1]);
      } else {
        proof.push(hashedLeaves[i][path])
      }
    }

    // Move up
    path = parseInt((path / 2).toString());
    i += 1
  }
    console.log(proof)
    proof.pop()

  return proof;
};

const computeRoot = (balances) => {
  const leaves = balances//sortAndAddIndex(balances);
  let hashedLeaves: string[] = leaves.map(hash);
  let wholeTree = []
  wholeTree.push(Array.from(hashedLeaves))
  while (hashedLeaves.length > 1) {
    hashedLeaves = reduceMerkleBranches(hashedLeaves);
      wholeTree.push(Array.from(hashedLeaves))
  }

  return {root: hashedLeaves[hashedLeaves.length - 1], wholeTree};
};

const computeAllProofs = (balances) => {
  const leaves = balances//sortAndAddIndex(balances);
  let proofs = [];
  const wholeTree = computeRoot(data)
  console.log(wholeTree)
  writeToFileSystem(JSON.stringify(wholeTree.root), "rootHash");
  leaves.forEach((leaf, i) => {
    console.time("proof")
    const proof = computeMerkleProof(wholeTree.wholeTree, leaf.index);
    proofs.push({ proof, leaf });
    console.log("proof x generated", i)
    console.timeEnd("proof")
  });
  writeToFileSystem(JSON.stringify(proofs), "allProofs");
};

computeAllProofs(data);
