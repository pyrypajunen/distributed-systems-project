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

    struct Stake{
        uint withdraw_after;
        uint amount;
        uint interest; //over 1000
    }

    // mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;
    mapping(address => Stake[]) public stakes;
    
    constructor(RWD _rwd, Tether _tether) public  {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }
    
    function depositTokens(uint _value, uint _duration) public {
        require(_value > 0, "Deposit amount cannot be 0 ");
        tether.transferFrom(msg.sender, address(this), _value);
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        stakes[msg.sender].push(Stake(block.timestamp+_duration, _value, _duration));

        hasStaked[msg.sender] = true;
    }

    // transfer interests(reward tokens) to investor
    function issueTokens() public {
        require(msg.sender == owner);
        for (uint256 index = 0; index < stakers.length; index++) {
            address recipient = stakers[index];
            uint balance = 0;
            for(uint i = 0; i < stakes[recipient].length; i++){
                balance = balance + stakes[recipient][i].amount*stakes[recipient][i].interest/1000;
            }

            // trasfer  interest rwd
            if (balance > 0) {
                rwd.transfer(recipient, balance);
            } 
        }
    }

    function  unstakeTokens() public {
        uint balance = 0;
        for(uint i = 0; i < stakes[msg.sender].length; i++){
            if(stakes[msg.sender][i].withdraw_after < block.timestamp){
                balance = balance + stakes[msg.sender][i].amount;
                stakes[msg.sender][i].amount = 0;
            }
        }
        require(balance > 0, "Staking balance cannot be 0");
        tether.transfer(msg.sender, balance);
    }

    function stakingBalance() public returns(uint){
        uint balance = 0;
        for(uint i = 0; i < stakes[msg.sender].length; i++){
            balance = balance + stakes[msg.sender][i].amount;
        }
        return balance;
    }

}