// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


contract CrowdFund {

    address owner;
    uint public maxDuration;
    uint public count;

    // Set the owner of the smart contract
    constructor (uint _maxDuration) {
        maxDuration = _maxDuration;
    }


    // STRUCT to keep up with the campaign goals
    struct Campaign {
        address owner;
        uint pledged;
        bool claimed;
        uint startAt;
        uint endAt;
        uint goal;
    }

    // LOGS 
    event Received(address indexed _sender, uint value);
    event Launch(
        uint id,
        address indexed owner,
        uint goal,
        uint32 startAt,
        uint32 endAt

    );
    event Cancel(uint id);
    event Pledge(uint indexed id, address indexed caller, uint amount);
    event Unpledge(uint indexed id, address indexed caller, uint amount);
    event Claim(uint id);
    event Refund(uint id, address indexed caller, uint amount);

    // MAPS
    mapping(uint => Campaign) public campaigns;
    mapping(uint => mapping(address => uint)) public pledgedAmount; // nested mapping represent


    // Function actual launch the campaign
    function launchCampaign(uint _goal, uint32 _startAt, uint32 _endAt) external {
        require(_startAt >= block.timestamp, "Sorry, the campaign is not started yet");
        require(_endAt > _startAt, "");
        require(_endAt <= block.timestamp + maxDuration);


        count += 1;
        campaigns[count] = Campaign({
            owner: msg.sender,
            goal: _goal,
            pledged: 0,
            startAt: _startAt,
            endAt: _endAt,
            claimed: false

        });

        emit Launch(count,msg.sender,_goal,_startAt,_endAt);
    }

    function cancel(uint _id) external {
        Campaign memory campaign = campaigns[_id];
        require(campaign.owner == msg.sender, "Sorry, you are not the owner of the campaign!");
        require(block.timestamp < campaign.startAt, "Campaign has already started!");


        delete campaigns[_id];
        emit Cancel(_id);
    }

    function pledge(uint _id, uint _amount) external {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp >= campaign.startAt, "Campaign has not Started yet");
        require(block.timestamp <= campaign.endAt, "Campaign has already ended");
        campaign.pledged += _amount;
        pledgedAmount[_id][msg.sender] += _amount;

        emit Pledge(_id, msg.sender, _amount);
    }

    // allows users removes the fund that a its plendged.
    function unPledge(uint _id,uint _amount) external {
        Campaign storage campaign = campaigns[_id];
        require(block.timestamp >= campaign.startAt, "Campaign has not Started yet");
        require(block.timestamp <= campaign.endAt, "Campaign has already ended");
        require(pledgedAmount[_id][msg.sender] >= _amount,"You do not have enough tokens Pledged to withraw");

        campaign.pledged -= _amount;
        pledgedAmount[_id][msg.sender] -= _amount;

        emit Unpledge(_id, msg.sender, _amount);
    }

    //let the OWNER claim the fund if following requirements happens.
    function claim(uint _id) external {
        Campaign storage campaign = campaigns[_id];
        require(campaign.owner == msg.sender, "You did not create this Campaign");
        require(block.timestamp > campaign.endAt, "Campaign has not ended");
        require(campaign.pledged >= campaign.goal, "Campaign did not succed");
        require(!campaign.claimed, "claimed");

        campaign.claimed = true;

        emit Claim(_id);
    }
 

    // IF the campaign is unsuccessful, users can withdraw their ether from the contract.
    function refund(uint _id) external {
        Campaign memory campaign = campaigns[_id];
        require(block.timestamp > campaign.endAt, "not ended");
        require(campaign.pledged < campaign.goal, "You cannot Withdraw, Campaign has succeeded");

        uint bal = pledgedAmount[_id][msg.sender];
        pledgedAmount[_id][msg.sender] = 0;

        emit Refund(_id, msg.sender, bal);
    }


    // This function receive ether and logs the address and value with event.
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable {}
}