
// Define which contracts instances we would like to interact with
const Migrations = artifacts.require("Migrations");

// 
module.exports = function deployer() {
    deployer.deploy(Migrations);
}