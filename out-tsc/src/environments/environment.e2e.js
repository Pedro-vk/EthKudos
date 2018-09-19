"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var truffle_hdwallet_provider_1 = require("truffle-hdwallet-provider");
var defaultGanacheMneonic = 'myth like bonus scare over problem client lizard pioneer submit female collect';
var ganacheProvider = new truffle_hdwallet_provider_1.default(defaultGanacheMneonic, "http://localhost:8545", 0, 10);
exports.environment = {
    production: false,
    web3Provider: ganacheProvider,
    defaultGasLimit: 6721975,
};
//# sourceMappingURL=environment.e2e.js.map