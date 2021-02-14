import { sanitize } from "../merkle/sanitizeData";
const data = require("../merkle/data");
const should = require("should");
const { assert } = require("chai");

describe("sanitize", function () {
	
  // it("should run pass good data", async () => {
  //   sanitize(data);
  // });
  // it("should fail with duplicate address", async () => {
  //   data[0].address = data[1].address;
  //   try {
  //     sanitize(data);
  //     should.fail("no error was thrown when it should have been");
  //   } catch (e) {
  //     assert.equal(
  //       e.message,
  //       `We got duplicates [{"address":"0x5b8eb89e04b7e5800e1834a4191cc67749878435","amount":"90"},{"address":"0x5b8eb89e04b7e5800e1834a4191cc67749878435","amount":"70"}]`
  //     );
  //   }
  // });
  // it("should fail with bad address", async () => {
  //   data[0].address = "0x1bd4Cec6F1CB4F26F7D620897fa1f8A9111bbB1";
  //   try {
  //     sanitize(data);
  //     should.fail("no error was thrown when it should have been");
  //   } catch (e) {
  //     assert.equal(
  //       e.message,
  //       `There is an invalid address 0x1bd4Cec6F1CB4F26F7D620897fa1f8A9111bbB1, Here is the error message too invalid address (argument="address", value="0x1bd4Cec6F1CB4F26F7D620897fa1f8A9111bbB1", code=INVALID_ARGUMENT, version=address/5.0.9)`
  //     );
	// }
	// data[0].address = "0x1bd4Cec6F1CB4F26F7D620897fa1f8A9111bbB12";
  // });
  // it("should fail with bad number", async () => {
	// data[0].amount = "12wfds"
  //   try {
  //     sanitize(data);
  //     should.fail("no error was thrown when it should have been");
  //   } catch (e) {
  //     assert.equal(
  //       e.message,
  //       `There is an invalid amount 0x1bd4Cec6F1CB4F26F7D620897fa1f8A9111bbB12, 12wfds`
  //     );
  //   }
  // });
});
