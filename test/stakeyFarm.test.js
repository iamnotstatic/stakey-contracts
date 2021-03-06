const { expect } = require('chai');

describe('StakeyFarm', () => {
  let StakeyToken,
    stakeyToken,
    StakeyFarm,
    stakeyFarm,
    Dai,
    dai,
    owner,
    addr1,
    addr2;

  beforeEach(async () => {
    StakeyToken = await ethers.getContractFactory('StakeyToken');
    stakeyToken = await StakeyToken.deploy();
    await stakeyToken.deployed();

    Dai = await ethers.getContractFactory('Dai');
    dai = await Dai.deploy();
    await dai.deployed();

    StakeyFarm = await ethers.getContractFactory('StakeyFarm');
    stakeyFarm = await StakeyFarm.deploy(stakeyToken.address, dai.address);
    await stakeyFarm.deployed();

    [owner, addr1, addr2, _] = await ethers.getSigners();

    // Transfer all StakeyToken to farm
    stakeyToken.transfer(stakeyFarm.address, '1000000000000000000000000');

    // Transfer some DAI to add1
    dai.connect(owner).transfer(addr1.address, '100000000000000000000');
  });

  describe('StakeyToken Deployment', async () => {
    it('has a name', async () => {
      let name = await stakeyToken.name();
      expect(name).to.equal('Stakey');
    });

    it('has a symbol', async () => {
      let symbol = await stakeyToken.symbol();
      expect(symbol).to.equal('STK');
    });
  });

  describe('Dai Token Deployment', async () => {
    it('has a name', async () => {
      let name = await dai.name();
      expect(name).to.equal('mDai');
    });

    it('has a symbol', async () => {
      let symbol = await dai.symbol();
      expect(symbol).to.equal('DAI');
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

  describe('Farming tokens', async () => {
    it('Staking mDai tokens', async () => {
      let result;

      result = await dai.balanceOf(addr1.address);
      expect(result.toString()).to.equal('100000000000000000000');

      await dai
        .connect(addr1)
        .approve(stakeyFarm.address, '100000000000000000000');
      await stakeyFarm.connect(addr1).deposit('100000000000000000000');

      // Check result after staking
      result = await dai.balanceOf(addr1.address);
      expect(result.toString()).to.equal('0');

      result = await dai.balanceOf(stakeyFarm.address);
      expect(result.toString()).to.equal('99000000000000000000');

      result = await dai.balanceOf(
        '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E'
      );
      expect(result.toString()).to.equal('1000000000000000000');

      result = await stakeyFarm.stakingBalance(addr1.address);
      expect(result.toString()).to.equal('99000000000000000000');

      result = await stakeyFarm.isStaking(addr1.address);
      expect(result.toString()).to.equal('true');

      // Issue tokens test
      await stakeyFarm.connect(owner).issueTokens();

      const balance = await stakeyToken.balanceOf(addr1.address);

      expect(balance.toString()).to.equal('7920000000000000000');

      await expect(stakeyFarm.connect(addr1).issueTokens()).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );

      // withdraw tokens
      await stakeyFarm.connect(addr1).withdraw('99000000000000000000');

      await expect(
        stakeyFarm.connect(addr1).withdraw('100000000000000000000')
      ).to.be.revertedWith('amount cannot be greater than staking balance');

      // Check result after unstaking
      result = await dai.balanceOf(addr1.address);
      expect(result.toString(), '99000000000000000000');

      result = await dai.balanceOf(stakeyFarm.address);
      expect(result.toString(), '0');

      result = await stakeyFarm.stakingBalance(addr1.address);
      expect(result.toString(), '0');

      result = await stakeyFarm.isStaking(addr1.address);
      expect(result.toString(), 'false');
    });
  });

  describe('Set fee address', async () => {
    it('Set a fee address', async () => {
      await stakeyFarm.connect(owner).setFeeAddress(owner.address);
    });

    it('throw error if not owner', async () => {
      await expect(
        stakeyFarm.connect(addr1).setFeeAddress(owner.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
