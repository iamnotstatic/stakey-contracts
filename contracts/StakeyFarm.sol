// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakeyFarm {

    string public name = "Stakey Farm";
    
    ERC20 public dai;
    ERC20 public stakeyToken;

    constructor(ERC20 _stakeyToken, ERC20 _dai) {
        dai = ERC20(_dai);
        stakeyToken = ERC20(_stakeyToken);
    }

}
