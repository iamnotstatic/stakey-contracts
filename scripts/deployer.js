const { ethers } = require("hardhat")

async const main = () => {

    // Deploy Stakey Token Contract
    const Token = await ethers.getContractFactory('StakeyToken');
    const token = await Token.deploy();
    await token.deployed();

    // Deploy Stakey Farm Contract
    const Farm = await ethers.getContractFactory('StakeyFarm');
    const farm = await Farm.deploy(token.address, '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa');
    await farm.deployed();

    // Transfer All token to farm
    await token.transfer(farm.address, 1000000000000000000000000);


    console.log(`Token address: ${token.address}`);
    console.log(`Farm address: ${farm.address}`);

}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
