const { ethers } = require("hardhat");

const main = async () => {
    const BuyMeACoffee = await ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee deployed to: ", buyMeACoffee.address);
}

main()
    .then(() => {
        process.exit(0);
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    })