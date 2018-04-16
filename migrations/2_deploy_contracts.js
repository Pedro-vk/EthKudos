const KudosOrganisations = artifacts.require("KudosOrganisations");
const KudosRouter = artifacts.require("KudosRouter");
const KudosTokenFactory = artifacts.require("KudosTokenFactory");
const KudosPollFactory = artifacts.require("KudosPollFactory");
const KudosStruct = artifacts.require("KudosStructs");
const StringUtils = artifacts.require("StringUtils");

module.exports = function(deployer) {
  deployer.deploy(KudosStruct)
    .then(() => {
      deployer.link(KudosStruct, [KudosTokenFactory, KudosPollFactory]);
      return deployer.deploy(StringUtils);
    })
    .then(() => {
      deployer.link(StringUtils, KudosTokenFactory);
      return deployer.deploy(KudosPollFactory);
    })
    .then(() => {
      deployer.link(KudosPollFactory, KudosTokenFactory);
      return deployer.deploy(KudosTokenFactory);
    })
    .then(() => {
      deployer.link(KudosTokenFactory, KudosOrganisations);
      return deployer.deploy(KudosRouter);
    })
    .then(() => {
      deployer.link(KudosRouter, [KudosTokenFactory, KudosOrganisations]);

      return KudosPollFactory.deployed().then(kudosPollFactory => {
        return KudosTokenFactory.deployed().then(kudosTokenFactory => {
          return KudosRouter.deployed().then(kudosRouter => {
            return kudosRouter.setResource('KudosPollFactory', '0.1', KudosPollFactory.address)
              .then(() => {
                return kudosRouter.setResource('KudosTokenFactory', '0.1', KudosTokenFactory.address);
              })
              .then(() => {
                return deployer.deploy(KudosOrganisations, KudosRouter.address);
              });
          });
        });
      });
    });
};
