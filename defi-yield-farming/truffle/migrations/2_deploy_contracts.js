const Migrations = artifacts.require("Migrations");
const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

module.exports = async function (deployer, network, accounts) {
   // deploy migrations
   await deployer.deploy(Migrations);
   // deploy Tethet contract
   await deployer.deploy(Tether);
   const tether = await Tether.deployed()
   // deploy RWD token
   await deployer.deploy(RWD);
   const rwd = await RWD.deployed()
   // deploy DB contract
   await deployer.deploy(DecentralBank, rwd.address, tether.address);
   const db  = await DecentralBank.deployed()

   // 1 million tokens transfer to DB
   await rwd.transfer(db ,"1000000000000000000000000")

   // Distribute 100 tether tokens to investor
   await tether.transfer(accounts[1],"1000000000000000000")

};
