const DB = artifacts.require('DecentralBank.sol');
const Tether = artifacts.require('Tether.sol');
const RewardToken = artifacts.require('RWD.sol');

require('chai')
.use(require('chai-as-promised'))
.should()


// Test for DecentralBank
contract('DecentralBank', ([owner, investor]) => {

    //contracts as a variable
    let tether, rwd, decentralBank

    // helper funtion to converting  wei to ether
    function convertToEth(num) {
        return  web3.utils.toWei(num, 'ether')
    }


    // This happens always before anything else
    before(async() => {
        // load contracts
        tether = await Tether.new()
        rwd = await RewardToken.new()
        decentralBank = await DB.new(rwd.address, tether.address)

        // transfer all tokens for test to db (1million)
        await rwd.transfer(decentralBank.address, convertToEth('1000000'))

        // transfer token to investor
        await tether.transfer(investor, convertToEth('100'), {from: owner})
    })

    // just testing if name matches
    describe("Tether Deployment", async() => {
        it("name matches", async() => {
            const name = await tether.name()
            assert.equal(name, "mTether")
        })
    })

    // just testing if name matches
    describe("Reward Token", async() => {
        it("name matches", async() => {
            const name = await rwd.name()
            assert.equal(name, "RewardToken")
        })
    })

    // just testing if name matches
    describe("Decentralized bank Deployment", async() => {
        it("name matches", async() => {
            const name = await decentralBank.name()
            assert.equal(name, "Decentral Bank")
        })
        // Check if contract has tokens
        it('contract has tokens', async() => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, convertToEth('1000000'))
        })
    })
    
    describe("Yield farming", async() => {
       it('Reward tokens for staking', async() => {
        let result
         //check investor balance before staking
        result = await tether.balanceOf(investor)
        assert.equal(result.toString(), convertToEth('100'), "Investor mock wallet balance before staking")

        // Check the staking with 100 ETH
        await tether.approve(decentralBank.address, convertToEth('100'), {from: investor})
        await decentralBank.depositToken(convertToEth('100'), {from: investor})

        // check investor balance after staking
        result = await tether.balanceOf(investor)
        assert.equal(result.toString(), convertToEth('0'), "investor mock wallet balance after staking")

        // Check the balance of DB
        let balanceDB = await tether.balanceOf(decentralBank.address)
        assert.equal(balanceDB, convertToEth('100'), "DB balance after investor staking")


        // Check isStaking is changed to true
        result = await decentralBank.isStaking(investor)
        assert.equal(result, true, "Staking has not started yet!")

        // issue tokens
        await decentralBank.issueToken({from: owner})

        // ensure that only owner can call this
        await decentralBank.issueToken({from: investor}).should.be.rejected


        // unstakeTokens function tests
        await decentralBank.unstakeTokens({from: investor})

        // check unstakingBalance
        result = await tether.balanceOf(investor)
        assert.equal(result.toString(), convertToEth('100'), "Investor current balance")

        // Check the updated balance of DB
        result = await tether.balanceOf(decentralBank.address)
        assert.equal(result.toString(), convertToEth('0'), "DB current balance")

        // check staking balance
        result = await decentralBank.isStaking(investor)
        assert.equal(result.toString(), 'false', "investor do not staking.")

       })
    })
})

