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

    ERC20 public dai;
    ERC20 public stakeyToken;

    constructor(ERC20 _stakeyToken, ERC20 _dai) {
        dai = ERC20(_dai);
        stakeyToken = ERC20(_stakeyToken);
    }

    function stakeTokens(uint256 _amount) public {
        require(_amount > 0, "invalid amount");

        dai.transferFrom(_msgSender(), address(this), _amount);

        stakingBalance[_msgSender()] += _amount;

        if (!hasStaked[_msgSender()]) stakers.push(_msgSender());

        isStaking[_msgSender()] = true;
        hasStaked[_msgSender()] = true;
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[_msgSender()];

        require(balance > 0, "Staking balance cannot be 0");

        stakingBalance[_msgSender()] = 0;

        dai.transfer(_msgSender(), balance);

        isStaking[_msgSender()] = false;

        
    }

    function issueTokens() public onlyOwner {
        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];

            if (balance > 0) stakeyToken.transfer(recipient, balance);
        }
    }
}
