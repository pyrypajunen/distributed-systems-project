// Define which contracts instances we would like to interact with
const Tether = artifacts.require("Tether");


// async == enable asynchronous (able to do other task too)
module.exports = async function deployer() {
    await deployer.deploy(Migrations);
    // await wait for Promise (It can wait for the response)
}