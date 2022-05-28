const fs = require('fs');

const provider = ethers.providers.getDefaultProvider(process.env.URL)
const privateKey = process.env.PRIVATE_KEY
const wallet = new ethers.Wallet(privateKey, provider)

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

async function deployContract(i) {
  const metadata = JSON.parse(fs.readFileSync('artifacts/contracts/Counter.sol/Counter.json').toString())
  const factory = new ethers.ContractFactory(metadata.abi, metadata.bytecode, wallet)
  const contract = await factory.deploy()
  try {
    await contract.deployed()
    console.log(`Deployment successful! Contract Address #${i}: ${contract.address}`)
    return contract
  } catch(err) {
    throw err
  }
}

async function main() {

  const b0 = await provider.getBalance(wallet.address);
  const t0 = performance.now();

  // 90 deployments
  for(let i=1; i<=90; ++i) {
    try {
      await deployContract(i);
    } catch(err) {
      console.log(err)
    }
  }

  // 10 deployments + 10 calls
  for(let i=91; i<=100; ++i) {
    try {
      let contract = await deployContract(i);
      for(let j=1; j<=10; ++j) {
        let tx = await contract.increase();
        await tx.wait();
        console.log(` Called increase() of contract ${contract.address} for ${j} times`);
      }
      let finalCount = await contract.getCounter();
      console.log(`   This number must be equal to 10: ${finalCount}`);
    } catch(err) {
      console.log(err)
    }
    console.log(`-------------------------------------------------`);
  }

  const b1 = await provider.getBalance(wallet.address);
  const gasSpent = parseFloat(ethers.utils.formatEther(b0.sub(b1))).toFixed(4);
  const t1 = performance.now();
  const elapsedTime = millisToMinutesAndSeconds(t1-t0);

  console.log(`Finished! You've spent Ξ${gasSpent} and it took ${elapsedTime} minutes`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
