const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Counter = await hre.ethers.getContractFactory("Counter");
    const counter = await Counter.deploy();

    await counter.deployed();
  });
});
