const Migrations = artifacts.require("Migrations");
const Tether = artifacts.require("Tether");

module.exports =   function (deployer) {
   deployer.deploy(Migrations);
   deployer.deploy(Tether);
};
