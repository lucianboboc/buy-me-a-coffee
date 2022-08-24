// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

// Returns the Ether balance of a given address
async function getBalance(address) {
  const balanceBigInt = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

// Log the Ether balances for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Log the memos stored on-chain from coffee purchases.
async function printMemos(memos) {
  for (const memo of memos) {
    const { timestamp, name: tipper, from: tipperAddress, message } = memo;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: ${message}`);
  }
}

async function main() {
  // Get example account.
  const [owner, tipper, tipper2, tipper3] = await ethers.getSigners();

  // Get the contract to deploy.
  const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to: ", buyMeACoffee.address);

  // Check balances before the coffee purchase.
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== start ==");
  await printBalances(addresses);

  // Buy the owner a few coffees.
  const tip = { value: ethers.utils.parseEther("1") };
  await buyMeACoffee.connect(tipper).buyCoffee("Carolina", "You're the best", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Vitto", "Amazing teacher :)", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Kay", "I love my Proof of Knowledge NFT", tip);

  // Check balances after coffee purchase.
  console.log("== bought coffee ==");
  await printBalances(addresses);

  // Withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balance after withdraw
  console.log("== after withdrawTips ==");
  await printBalances(addresses);

  // Read all the memos left for the owner.
  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
