const HDWalletProvider = require("truffle-hdwallet-provider");

const {TRUFFLE_MNEMONIC, TRUFFLE_INFURA_API_KEY} = process.env;

module.exports = {
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    ropsten: {
      provider: new HDWalletProvider(TRUFFLE_MNEMONIC, `https://ropsten.infura.io/${TRUFFLE_INFURA_API_KEY}`, 0, 10),
      gas: 4600000,
      gasPrice: 8 * 1000000000,
      network_id: 3
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
};
