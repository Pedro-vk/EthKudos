# EthKudos [![CircleCI](https://circleci.com/gh/Pedro-vk/EthKudos/tree/master.svg?style=shield)](https://circleci.com/gh/Pedro-vk/workflows/EthKudos/tree/master) [![Coverage Status](https://coveralls.io/repos/github/Pedro-vk/EthKudos/badge.svg?branch=master)](https://coveralls.io/github/Pedro-vk/EthKudos?branch=master) [![EthKudos status](https://img.shields.io/website-up-down-green-red/http/eth-kudos.com.svg)](https://status.eth-kudos.com/) [![GitHub license](https://img.shields.io/github/license/Pedro-vk/EthKudos.svg)](https://github.com/Pedro-vk/EthKudos/blob/master/LICENSE)


EthKudos is a gratitudes/kudos system that provides to companies, organisations or teams to boost the cooperation between the coworkers.

EthKudos allows to create a new organisation over Ethereum, this organisation is owned by the creator. Ethereum is the technology that ensures that the owner of the organisation and the members are who can interact with this organisation.

## Technologies

EthKudos, as a dapp, is built with Angular, Angular Material, Web3 and Truffle contract.

The smart contract, wrote in Solidity for Ethereum, provides the "backend side" as other dapps. To help with the coding of these smart contracts is used Truffle to deploy and test them.

## Collaborate

EthKudos is open to everyone that wants to improve the dapp. Feel free to collaborate opening [issues](https://github.com/Pedro-vk/EthKudos/issues) or coding.

### Work on dapp

#### Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

#### Build

Run `npm run build` to build the project. The build artefacts will be stored in the `dist/` directory.

#### Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Work on smart contracts

#### Development server

Install and open [Ganache](https://truffleframework.com/ganache), it provides an Ethereum network quickly and it's fast to develop on it.

Run `npm run deploy:dev` to deploy the smart contracts on Ganache, it is going to define the new contract address on the schema of each contract.

#### Test

Run `npm run test:sol` to run the unit test and generate the coverage.
