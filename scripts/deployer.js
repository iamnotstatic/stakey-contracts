const { ethers } = require('hardhat');

const main = async () => {
  // Deploy Stakey Token Contract
  const Token = await ethers.getContractFactory('StakeyToken');
  const token = await Token.deploy();
  await token.deployed();

  // Deploy mDAI Token Contract
  // const Dai = await ethers.getContractFactory('Dai');
  // const dai = await Dai.deploy();
  // await dai.deployed();

  // Deploy Stakey Farm Contract
  const Farm = await ethers.getContractFactory('StakeyFarm');
  const farm = await Farm.deploy(
    token.address,
    '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'
  );
  await farm.deployed();

  // Transfer All token to farm
  await token.transfer(farm.address, '800000000000000000000000');

  console.log(`Token address: ${token.address}`);
  console.log(`Farm address: ${farm.address}`);
  // console.log(`Dai address: ${dai.address}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
