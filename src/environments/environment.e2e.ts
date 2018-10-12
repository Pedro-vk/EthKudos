import PrivateKeyProvider from 'truffle-privatekey-provider';

const privateKey = '4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d';
const ganacheProvider = new PrivateKeyProvider(privateKey, 'http://localhost:8545');

export const environment = {
  production: false,
  web3Provider: ganacheProvider,
  defaultGasLimit: 6721975,
  moesifToken: undefined,
};
