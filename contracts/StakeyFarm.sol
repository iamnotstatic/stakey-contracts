// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakeyFarm is Ownable {
    string public name = "Stakey Farm";

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

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

        dai.transferFrom(_msgSender(), address(this), _amount);

        stakingBalance[_msgSender()] += _amount - value;

        if (!hasStaked[_msgSender()]) stakers.push(_msgSender());

        isStaking[_msgSender()] = true;
        hasStaked[_msgSender()] = true;

        emit Deposit(_msgSender(), _amount - value);
    }

    function withdraw() public {
        uint256 balance = stakingBalance[_msgSender()];

        require(balance > 0, "Staking balance cannot be 0");

        stakingBalance[_msgSender()] = 0;

        dai.transfer(_msgSender(), balance);

        isStaking[_msgSender()] = false;

        emit Withdraw(_msgSender(), balance);
    }

    function issueTokens() public onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 earns = stakingBalance[recipient] / 100 * wpr;

            if (earns > 0) stakeyToken.transfer(recipient, earns);
        }
    }
}
