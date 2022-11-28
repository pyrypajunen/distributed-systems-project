// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

//importing other contracts
import './RWD.sol';
import './Tether.sol';

// define contract Migrations
contract DecentralBank {

    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    
    constructor(RWD _rwd, Tether _tether)  {
        rwd = _rwd;
        tether = _tether;
    }
    
}