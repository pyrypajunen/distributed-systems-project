pragma solidity ^0.5.0;

//importing other contracts
import './RWD.sol';
import './Tether.sol';

// define contract Migrations
contract DecentralBank {

    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;



    
    constructor(RWD _rwd, Tether _tether) public  {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }


    function depositToken(uint _value) public {

        require(_value > 0, "Deposit amount cannot be 0 ");
        tether.transferFrom(msg.sender, address(this), _value);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _value;


        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // transfer interests(reward tokens) to investor
    function issueToken() public {
        require(msg.sender == owner);
        for (uint256 index = 0; index < stakers.length; index++) {
            address recipient = stakers[index];
            // trasfer  interest rwd
            uint balance = stakingBalance[recipient] / 10;
            
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            } 
        }
    }
    function  unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "Staking balance cannot be 0");
        tether.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] - balance;
        isStaking[msg.sender] = false;

    }

}