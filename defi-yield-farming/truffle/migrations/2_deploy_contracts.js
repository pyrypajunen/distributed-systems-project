const Migrations = artifacts.require("Migrations");
const Tether = artifacts.require("Tether");
const RWD = artifacts.require("RWD");
const DecentralBank = artifacts.require("DecentralBank");

module.exports = function (deployer) {
   // deploy migrations
   deployer.deploy(Migrations);
   // deploy Tethet contract
   deployer.deploy(Tether);
   // deploy RWD token
   deployer.deploy(RWD);
   // deploy DB contract
   deployer.deploy(DecentralBank);
};
