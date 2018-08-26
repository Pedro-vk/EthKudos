import HDWalletProvider from 'truffle-hdwallet-provider';

const defaultGanacheMneonic = 'myth like bonus scare over problem client lizard pioneer submit female collect';
const ganacheProvider = new HDWalletProvider(defaultGanacheMneonic, `http://localhost:8545`, 0, 10);

export const environment = {
  production: false,
  web3Provider: ganacheProvider,
  defaultGasLimit: 6721975,
};
