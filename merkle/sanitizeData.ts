const data = require("./prepare/addresses.json");
import { utils, BigNumber, ethers } from "ethers";
import { writeFileSync } from "fs";

const totalAmountToDrop = 2_500_000

const sanitize = (data) => {
  data.map((x) => validateAddress(x));
  const nonDuplicatedData: any = findDuplicates(data);
  console.log(data.length, nonDuplicatedData.length);
  console.log("the total amount of addresses are", nonDuplicatedData.length);
  const amountPerIndividual = totalAmountToDrop / nonDuplicatedData.length
  const formattedAmount = ethers.utils.parseEther(amountPerIndividual.toString())
  console.log(formattedAmount.toString())
  const formattedData = []
  let i = 0
  nonDuplicatedData.map((address) => {
    if (address) {
      formattedData.push({address, amount: formattedAmount.toString(), index: i})
      i += 1
    }
  })
  writeFileSync('./merkle/data.json', JSON.stringify(formattedData));
};

const validateAddress = (address) => {
  try {
    if (address){
      utils.getAddress(address);
    }
  } catch (e) {
    throw new Error(
      `There is an invalid address ${address}, Here is the error message too ${e.message}`
    );
  }
};

const findDuplicates = (arr): any => {
  return Array.from(new Set(arr));
};

sanitize(data);
