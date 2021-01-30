import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import { Contract, Signer } from "ethers";
import { expect } from "chai";
import { sortAndAddIndex, hash } from "../merkle/merkle";

const rootHash = require("../merkle/data/rootHash.json");
const jsonData: any[] = sortAndAddIndex(require("../merkle/data.json"));
const allProofs = require("../merkle/data/allProofs.json");


describe("Airdrop", function () {
  let accounts: Signer[];
  let airdrop: Contract;
  let airdropToken: Contract;

  const totalTokens = jsonData.reduce((previousValue: any, currentValue: any) => {
      return previousValue.add(ethers.BigNumber.from(currentValue.amount));
  }, ethers.BigNumber.from("0"))

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


  describe("After sending tokens", async () => {
    
    beforeEach(async () => {
        await airdropToken.mint(airdrop.address, totalTokens);
        expect(await airdropToken.balanceOf(airdrop.address)).to.equal(totalTokens);
    });

      it("should succeed if proof is correct", async () => {

        await airdrop.redeemPackage(
            jsonData[0].index,
            jsonData[0].address,
            jsonData[0].amount,
            allProofs[jsonData[0].address]
        );

        expect(await airdropToken.balanceOf(jsonData[0].address)).to.equal(
          jsonData[0].amount
        );
      });

      it("should fail to redeem twice", async () => {

        await airdrop.redeemPackage(
            jsonData[0].index,
            jsonData[0].address,
            jsonData[0].amount,
            allProofs[jsonData[0].address]
        );

        expect(await airdropToken.balanceOf(jsonData[0].address)).to.equal(
          jsonData[0].amount
        );

        expect(
          airdrop.redeemPackage(
            jsonData[0].index,
            jsonData[0].address,
            jsonData[0].amount,
            allProofs[jsonData[0].address]
          )
        ).to.be.revertedWith("Airdrop: already redeemed");
      });

      it("should fail if wrong amount", async () => {

        expect(
          airdrop.redeemPackage(
            jsonData[0].index,
            jsonData[0].address,
            jsonData[0].amount + "1",
            allProofs[jsonData[0].address]
          )
        ).to.be.revertedWith("Airdrop: Merkle root mismatch");

        await airdrop.redeemPackage(
            jsonData[0].index,
            jsonData[0].address,
            jsonData[0].amount,
            allProofs[jsonData[0].address]
        );

        expect(
            await airdropToken.balanceOf(jsonData[0].address)
        ).to.equal(jsonData[0].amount);
      });

      it("should fail if wrong address", async () => {

        expect(
          airdrop.redeemPackage(
            jsonData[0].index,
            ethers.constants.AddressZero,
            jsonData[0].amount,
            allProofs[jsonData[0].address]
          )
        ).to.be.revertedWith("Airdrop: Merkle root mismatch");

        await airdrop.redeemPackage(
            jsonData[0].index,
            jsonData[0].address,
            jsonData[0].amount,
            allProofs[jsonData[0].address]
        );

        expect(
            await airdropToken.balanceOf(jsonData[0].address)
        ).to.equal(jsonData[0].amount);
      });

      it("should succeed for every record in the data file", async () => {

        for (let index = 0; index < jsonData.length; index += 1) {
            const element = jsonData[index];

            await airdrop.redeemPackage(
                element.index,
                element.address,
                element.amount,
                allProofs[element.address]
            );

            expect(
                await airdropToken.balanceOf(element.address)
            ).to.equal(element.amount);
        }

        expect(
            await airdropToken.balanceOf(airdrop.address)
        ).to.equal(0);

      });

      it("should prevent every record from double redeeming", async () => {

        for (let index = 0; index < jsonData.length; index += 1) {
            const element = jsonData[index];

            // First succeeds.
            await airdrop.redeemPackage(
                element.index,
                element.address,
                element.amount,
                allProofs[element.address]
            );

            expect(
                await airdropToken.balanceOf(element.address)
            ).to.equal(element.amount);

        }

        for (let index = 0; index < jsonData.length; index += 1) {
            const element = jsonData[index];

            // Second attempt must fail.
            expect(
              airdrop.redeemPackage(
                element.index,
                element.address,
                element.amount,
                allProofs[element.address]
              )
            ).to.be.revertedWith("Airdrop: already redeemed");
        }

        expect(
            await airdropToken.balanceOf(airdrop.address)
        ).to.equal(0);

      });
  })

});
