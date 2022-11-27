// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

// define contract Migrations
contract Migrations {

    // set variables 1. owner, 2. last_completed_migration uint 
    address public owner;
    uint public last_completed_migration;

    // define constructor -> what i need to defina first?
    constructor() {
        owner = msg.sender;
    }

    //  modifier which restrict the usages
    modifier restricted() {
        require(msg.sender == owner);
        _;
    }


    // function set the migration completed
    function setCompleted(uint _completed) public restricted {
        last_completed_migration = _completed;
    }

    // function upgrade -> 
    function upgrade(address _newAddress) public restricted {
        Migrations upgraded = Migrations(_newAddress);
        upgraded.setCompleted(last_completed_migration);
    }
}