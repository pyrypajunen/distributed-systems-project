require("babel-register");
require("babel-polyfill");

module.exports = {
    network: {
        development: {
            host: "127.0.0.1:",
            port: "7545",
            networkId: "*" // connect to any network
        }
    },
    contracts_directory: "./src/contracts/",
    contracts_build_directory:"./src/truffle_abis/",
    compliers: {
        solc: "^0.8.0",
        optimizer: {
            enabled: true,
            runs: 200
        },
    },
}