const { expect } = require('chai');

describe('StakeyFarm', () => {
  let StakeyToken, stakeyToken, StakeyFarm, stakeyFarm, owner, addr1, addr2;

  beforeEach(async () => {
    StakeyToken = await ethers.getContractFactory('StakeyToken');
    stakeyToken = await StakeyToken.deploy();
    await stakeyToken.deployed();

    StakeyFarm = await ethers.getContractFactory('StakeyFarm');
    stakeyFarm = await StakeyFarm.deploy(
      stakeyToken.address,
      '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa'
    );
    await stakeyFarm.deployed();

    [owner, addr1, addr2, _] = await ethers.getSigners();

    // Transfer all StakeyToken to farm
    stakeyToken.transfer(stakeyFarm.address, '1000000000000000000000000');
  });

  describe('StakeyToken Deployment', async () => {
    it('has a name', async () => {
      let name = await stakeyToken.name();
      console.log(name);
      expect(name).to.equal('Stakey');
    });

    it('has a symbol', async () => {
      let symbol = await stakeyToken.symbol();
      expect(symbol).to.equal('STK');
    });
  });

  describe('StakeyFarm Deployment', async () => {
    it('has a name', async () => {
      const name = await stakeyFarm.name();
      expect(name).to.equal('Stakey Farm');
    });

    it('contract has initial tokens', async () => {
      const balance = await stakeyToken.balanceOf(stakeyFarm.address);
      expect(balance.toString()).to.equal('1000000000000000000000000');
    });
  });
});
