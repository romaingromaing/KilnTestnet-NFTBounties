const hre = require("hardhat");
require('dotenv').config();

async function main() {
  console.log(process.env.PRIVATE_KEY);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
