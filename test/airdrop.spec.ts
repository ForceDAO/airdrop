import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { Contract, Signer } from "ethers";
import { expect } from "chai";
import { sortAndAddIndex, hash } from "../merkle/merkle";

const rootHash = require("../merkle/data/rootHash.json");
const jsonData = sortAndAddIndex(require("../merkle/data.json"));
const allProofs = require("../merkle/data/allProofs.json");

describe("Airdrop", function () {
  let accounts: Signer[];
  let airdrop: Contract;
  let airdropToken: Contract;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    
    // Mock Token
    const AirdropToken = await ethers.getContractFactory("AirdropToken");
    airdropToken = await AirdropToken.deploy("Testing Token", "TEST");
    await airdropToken.deployed();
    
    // Airdrop contract
    const Airdrop = await ethers.getContractFactory("Airdrop");
    airdrop = await Airdrop.deploy(airdropToken.address, rootHash);
    await airdrop.deployed();
  });

  it("should record constructor arguments", async () => {
    expect(await airdrop.getRootHash()).to.equal(rootHash);
    expect(await airdrop.getTokenAddress()).to.equal(airdropToken.address);
  });

  it("should fail if no tokens available", async () => {
    expect(
      airdrop.redeemPackage(
        jsonData[0].index,
        jsonData[0].address,
        jsonData[0].amount,
        allProofs[jsonData[0].address]
      )
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
  });


});
