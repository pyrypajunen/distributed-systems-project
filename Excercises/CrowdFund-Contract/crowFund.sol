// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "CrowdFund-Contract/IERC20.sol";

contract CrowdFund {

    event Launch(
        uint id,
        address indexed owner,
        uint goal,
        uint32 startAt,
        uint32 endAt

    );
    event Cancel(uint id);
    event Pledge(uint indexed id, address indexed caller, uint amount);
    event UnPledge(uint indexed id, address indexed caller, uint amount);
    event Claimed(uint id); 
    event ReFund(uint id, address indexed caller, uint balance); 

    struct Campaign {
        address owner;
        uint goal;
        uint pledged;
        uint32 startAt;
        uint32 endAt;
        bool claimed;
    }

    IERC20 public immutable token;
    uint public count;
    mapping(uint => Campaign) public campaigns;
    mapping(uint => mapping(address => uint)) public pledgedAmount;

    constructor(address _token) {
        token = IERC20(_token);
    }
    
    // function launch
    function launch(uint _goal, uint32 _startAt, uint32 _endAt) external {
        require(_startAt >= block.timestamp, "Starting Campaign.");
        require(_endAt >= _startAt, "Campaign ends.");
        require(_endAt <= block.timestamp + 30 days, "Campaign max duration reached!");


        count += 1;
        campaigns[count] = Campaign({
            owner: msg.sender,
            goal: _goal,
            pledged: 0,
            startAt: _startAt,
            endAt: _endAt,
            claimed: false
        });

        emit Launch(count, msg.sender, _goal, _startAt, _endAt);
    }

    // cancel
    function cancel(uint _id) external {
        Campaign memory campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "You are not the owner of tha campaign!");
        require(block.timestamp < campaign.startAt, "The campaign has not started yet.");
        require(block.timestamp > campaign.endAt, "The campaign has already ended!");
        delete campaigns[_id];

        emit Cancel(_id);
    }

    // pledge
    function pledge(uint _id, uint _amount) external {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp >= campaign.startAt, "The campaign has not started yet.");
        require(block.timestamp <= campaign.endAt, "The campaign has already ended!");

        // Holds the whole tokes that are pledged in to the campaign.
        campaign.pledged += _amount;
        pledgedAmount[_id][msg.sender] += _amount;
        token.transferFrom(msg.sender, address(this), _amount);

        emit Pledge(_id, msg.sender, _amount);
    }

    // unpledge
    function unpledge(uint _id, uint _amount) external {

        Campaign storage campaign = campaigns[_id];
        require(block.timestamp <= campaign.endAt, "Campaign has ended!");

        //Update the pledge amount.
        campaign.pledged -= _amount;
        pledgedAmount[_id][msg.sender] -= _amount;
        token.transfer(msg.sender, _amount);

        emit UnPledge(_id, msg.sender, _amount);
    }
    // claim
    function claim(uint _id) external {
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "You are not the owner, No change to claim");
        require(block.timestamp > campaign.endAt, "Not ended yet");
        require(campaign.pledged >= campaign.goal, "The goal not reached!");
        require(!campaign.claimed, "Claimed already!");

        campaign.claimed = true;
        token.transfer(msg.sender, campaign.pledged);

        emit Claimed(_id);
    }


    // refund is campaign wasn't succeful.
    function refund(uint _id) external{
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp > campaign.endAt, "The campaign has not ended!");
        require(campaign.goal > campaign.pledged, "Goal reached!");


        uint balance = pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender] = 0;
        token.transfer(msg.sender, balance);


        emit ReFund(_id, msg.sender, balance);

    }

}