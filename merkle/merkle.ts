import { utils, BigNumber } from "ethers";
import { writeToFileSystem } from "./helpers";
const data = require("./data")

export const hash = (leaf): string => {
	return utils.keccak256(
    utils.defaultAbiCoder.encode(
      ["uint256", "address", "uint256"],
      [BigNumber.from(leaf.index), leaf.address, BigNumber.from(leaf.amount)]
    )
  );
}

const reduceMerkleBranches = (leaves: string[]) => {
    let output = [];
    while (leaves.length) {
        let left = leaves.shift()
        let right = (leaves.length === 0) ? left : leaves.shift();
        output.push(
          utils.keccak256(
            utils.defaultAbiCoder.encode(["bytes32", "bytes32"],[left, right])
          )
        ); 
    }
    return output;
}

const computeMerkleProof = (balances, index: number) => {
  let leaves = sortAndAddIndex(balances);
  let hashedLeaves: string[] = leaves.map(hash);

  if (index == null) {
    throw new Error("address not found");
  }

  let path: number = index;
  let proof = [];

  while (hashedLeaves.length > 1) {
    if (path % 2 == 1) {
      proof.push(hashedLeaves[path - 1]);
    } else {
      proof.push(hashedLeaves[path + 1]);
    }

    // Reduce the merkle tree one level
    hashedLeaves = reduceMerkleBranches(hashedLeaves);

    // Move up
    path = parseInt((path / 2).toString());
  }

  return proof;
}

export const sortAndAddIndex = (balances) => {
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
    return { ...a, index: i };
  });
}


const computeRoot = (balances) => {
    const leaves = sortAndAddIndex(balances);
    let hashedLeaves: string[] = leaves.map(hash);

    while (hashedLeaves.length > 1) {
        hashedLeaves = reduceMerkleBranches(hashedLeaves);
    }

    return hashedLeaves[0];
}

const computeAllProofs = (balances) => {
    const leaves = sortAndAddIndex(balances);
    let proofs = [];
    leaves.forEach(leaf => {
        const proof = computeMerkleProof(leaves, leaf.index);
        proofs.push({proof, leaf})
        // writeToFileSystem(JSON.stringify(proofs[leaf.address]), leaf.address);
    });
    writeToFileSystem(JSON.stringify(proofs), "allProofs");
}

writeToFileSystem(JSON.stringify(computeRoot(data)), 'rootHash');
computeAllProofs(data);
