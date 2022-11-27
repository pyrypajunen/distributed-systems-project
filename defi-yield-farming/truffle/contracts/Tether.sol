// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;


// define contract tether
contract Tether {

    string public name = "Tether";
    string public symbol = "USDT";
    uint256 public totalSupply = 1000000000000000000000000; // 1 million tokens
    uint8 public decimals = 18;
}

