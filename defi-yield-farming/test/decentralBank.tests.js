const DB = artifacts.require('DecentralBank.sol');
const Tether = artifacts.require('Tether.sol');
const RewardToken = artifacts.require('RWD.sol');

require('chai')
.use(require('chai-as-promised'))
.should()


// Test for DecentralBank
contract('DecentralBank', ([owner, customer]) => {

    //contracts as a variable
    let tether, rwd, decentralBank

    // helper funtion to converting to ether
    function convertToEth(num) {
        return  web3.utils.toWei(num, 'ether')
    }



    before(async() => {
        // load contracts
        tether = await Tether.new()
        rwd = await RewardToken.new()
        decentralBank = await DB.new(rwd.address, tether.address)

        // transfer all tokens for test to db (1million)
        await rwd.transfer(decentralBank.address, convertToEth('1000000'))

        // transfer token to customer
        await tether.transfer(customer, convertToEth('100'), {from: owner})
    })


    describe("Tether Deployment", async() => {
        it("name matches", async() => {
            const name = await tether.name()
            assert.equal(name, "mTether")
        })
    })


    describe("Reward Token", async() => {
        it("name matches", async() => {
            const name = await rwd.name()
            assert.equal(name, "RewardToken")
        })
    })

    describe("Decentralized bank Deployment", async() => {
        it("name matches", async() => {
            const name = await decentralBank.name()
            assert.equal(name, "Decentral Bank")
        })

        it('contract has tokens', async() => {
            let balance = await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, convertToEth('1000000'))
        })
    })
})

