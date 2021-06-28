// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dai is ERC20 {
    uint256 private _initialSupply = 1000000000000000000000000;
    
    string private _name = "mDai";
    string private _symbol = "DAI";

    constructor() ERC20(_name, _symbol) {
        _mint(msg.sender, _initialSupply);
    }
}
