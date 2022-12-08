pragma solidity ^0.5.0;


// define contract reward token
contract RWD {

    string public name = "RewardToken";
    string public symbol = "RWD";
    uint256 public totalSupply = 1000000000000000000000000;
 
    // events for logging
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

   
    event Approval(
        address _owner,
        address _spender,
        uint _value
    );

    // mappings balances and allowance 
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;

    // constructor set the initial infos
    constructor() public {
        balanceOf[msg.sender] = totalSupply;
    }

    // function for transefaring tokens/
    function transfer(address _to, uint256 _value) public returns (bool succees) {
        // require that the value is greater or equal for transfer
        require(balanceOf[msg.sender] >= _value, "The value is bigger than your balance - reverting transfer.");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        // "run" the event for log
        emit Transfer(msg.sender, _to, _value);
        return true;
        
    }
      
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;

    }

    function tranferFrom(address _from, address _to, uint256 _value) public returns (bool succees) {
        require( _value <= balanceOf[msg.sender], "The value is bigger than your balance - reverting transfer.");
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_to] += _value;
        balanceOf[_from] -= _value;
        allowance[msg.sender][_from] -= _value;
        emit Transfer(_from, _to, _value);
        return true;

    }
}