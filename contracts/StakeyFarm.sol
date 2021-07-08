// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "hardhat/console.sol";

contract StakeyFarm is Ownable {
    using SafeERC20 for ERC20;
    using SafeMath for uint256;

    string public name = "Stakey Farm";

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    address public feeAddress = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;

    uint256 public _taxFee = 1;
    uint256 public wpr = 8;

    ERC20 public dai;
    ERC20 public stakeyToken;

    constructor(ERC20 _stakeyToken, ERC20 _dai) {
        dai = ERC20(_dai);
        stakeyToken = ERC20(_stakeyToken);
    }

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);

    function deposit(uint256 _amount) public {
        require(_amount > 0, "invalid amount");

        uint256 value = (_amount / 100) * _taxFee;

        dai.safeTransferFrom(_msgSender(), address(this), _amount.sub(value));

        dai.safeTransferFrom(_msgSender(), feeAddress, value);

        stakingBalance[_msgSender()] = stakingBalance[_msgSender()]
        .add(_amount)
        .sub(value);

        if (!hasStaked[_msgSender()]) stakers.push(_msgSender());

        isStaking[_msgSender()] = true;
        hasStaked[_msgSender()] = true;

        emit Deposit(_msgSender(), _amount.sub(value));
    }

    function withdraw(uint256 _amount) public {
        uint256 balance = stakingBalance[_msgSender()];

        require(_amount > 0, "amount cannot be 0");
        require(balance >= _amount , "amount cannot be greater than staking balance");

        stakingBalance[_msgSender()].sub(_amount);

        dai.safeTransfer(_msgSender(), _amount);

        if (stakingBalance[_msgSender()].sub(_amount) <= 0)
            isStaking[_msgSender()] = false;

        emit Withdraw(_msgSender(), _amount);
    }

    function issueTokens() public onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 earns = (stakingBalance[recipient] / 100) * wpr;

            if (earns > 0) stakeyToken.transfer(recipient, earns);
        }
    }

    function setFeeAddress(address _feeAddress) public onlyOwner {
        feeAddress = _feeAddress;
    }
}
