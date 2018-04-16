const KudosRouter = artifacts.require("KudosRouter");
const KudosTokenFactory = artifacts.require("KudosTokenFactory");
const KudosPollFactory = artifacts.require("KudosPollFactory");
const KudosStruct = artifacts.require("KudosStructs");
const StringUtils = artifacts.require("StringUtils");

module.exports = function(deployer) {
  KudosTokenFactory.deployed()
    .then(kudosTokenFactory => {
      return kudosTokenFactory.version();
    })
    .then(kudosTokenFactoryVersion => {
      if (+kudosTokenFactoryVersion === 0.1) {
        deployer.link(KudosStruct, [KudosTokenFactory, KudosPollFactory]);
        deployer.link(StringUtils, KudosTokenFactory);
        deployer.link(KudosPollFactory, KudosTokenFactory);
        return deployer.deploy(KudosTokenFactory);
      }
    })
    .then(() => {
      return KudosTokenFactory.deployed();
    })
    .then(newKudosTokenFactory => {
      return KudosRouter.deployed().then(kudosRouter => {
        return kudosRouter.setResource('KudosTokenFactory', '0.2', newKudosTokenFactory.address);
      });
    });
};
