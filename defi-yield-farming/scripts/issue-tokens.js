const DecentralBank = artifacts.require("DecentralBank.sol");


module.exports = async function issueRewards(callback) {
    let db = await DecentralBank.deployed();
    await db.issueToken();
    console.log("Tokens has been issued successfully!!");
    callback();
}

