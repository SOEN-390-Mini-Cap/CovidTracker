import { expect } from "chai";
import {myFunc} from "../../src/test";

describe("Index", () => {
    it("should always pass", async () => {
        expect(myFunc()).to.equal(true);
    });
});
