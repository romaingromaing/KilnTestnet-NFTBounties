const fs = require('fs');

async function deployContract() {
  const provider = ethers.providers.getDefaultProvider(process.env.URL)
  const privateKey = process.env.PRIVATE_KEY
  const wallet = new ethers.Wallet(privateKey, provider)
  const metadata = JSON.parse(fs.readFileSync('artifacts/contracts/Counter.sol/Counter.json').toString())
  const factory = new ethers.ContractFactory(metadata.abi, metadata.bytecode, wallet)
  const contract = await factory.deploy()
  await contract.deployed()
  console.log(`Deployment successful! Contract Address: ${contract.address}`)
  return contract;
}

async function main() {

  var counters = [];

  // 100 deployments
  for(let i=0; i<=99; ++i) {
    let contract = await deployContract();
    counters.push(contract);
    console.log("Deployed contract #"+i);
  }

  // Call 10 times 10 different contracts
  for(let i=0; i<=9; ++i) {
    let contract = counters[i];
    for(let j=0; j<9; ++j) {
      await contract.increase();
      console.log("Called increase() of contract "+contract.address+" for "+j+" times");
    }
    let finalCount = await contract.getCounter();
    finalCount++;
    console.log("This number must be equal to 10: "+finalCount);
  }

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
