// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StakeyToken is ERC20 {
    uint256 private _initialSupply = 1000000000000000000000000;
    
    string private _name = "Stakey";
    string private _symbol = "STK";

    constructor() ERC20(_name, _symbol) {
        _mint(msg.sender, _initialSupply);
    }
}
