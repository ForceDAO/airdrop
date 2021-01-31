const data = require("./data");
import { utils, BigNumber } from "ethers";

let totalAmount = BigNumber.from("0");

const sanitize = (data) => {
  findDuplicates(data);
  data.map((user) => {
    validateAddress(user.address);
    logTotalAmount(user.amount, user.address);
  });
  console.log("the total amount promised is", totalAmount.toString())
};

const logTotalAmount = (amount, address) => {
  try {
    BigNumber.from(amount)
    totalAmount = totalAmount.add(amount);
  } catch (e) {
    throw new Error(
      `There is an invalid amount ${address}, ${amount}`
    );
  }
};

const validateAddress = (address) => {
  try {
    utils.getAddress(address);
  } catch (e) {
    throw new Error(
      `There is an invalid address ${address}, Here is the error message too ${e.message}`
    );
  }
};

const findDuplicates = (arr) => {
  arr.sort(function (a, b) {
    const keyA = a.address;
    const keyB = b.address;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });

  let results = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i + 1].address == arr[i].address) {
      results.push(arr[i]);
      results.push(arr[i + 1]);
    }
  }
  if (results.length != 0) {
    throw new Error(`We got duplicates ${JSON.stringify(results)}`);
  }
};

sanitize(data);
