const KudosOrganisations = artifacts.require("KudosOrganisations");
const KudosRouter = artifacts.require("KudosRouter");
const KudosTokenFactory = artifacts.require("KudosTokenFactory");
const KudosPollFactory = artifacts.require("KudosPollFactory");
const KudosStruct = artifacts.require("KudosStructs");
const StringUtils = artifacts.require("StringUtils");

module.exports = async function(deployer) {
  await deployer.deploy(KudosStruct);
  deployer.link(KudosStruct, [KudosTokenFactory, KudosPollFactory]);
  await deployer.deploy(StringUtils);
  deployer.link(StringUtils, KudosTokenFactory);

  await deployer.deploy(KudosPollFactory);
  deployer.link(KudosPollFactory, KudosTokenFactory);

  await deployer.deploy(KudosTokenFactory);
  deployer.link(KudosTokenFactory, KudosOrganisations);

  await deployer.deploy(KudosRouter);
  deployer.link(KudosRouter, [KudosTokenFactory, KudosOrganisations]);

  const kudosPollFactory = await KudosPollFactory.deployed();
  const kudosTokenFactory = await KudosTokenFactory.deployed();
  const kudosRouter = await KudosRouter.deployed();

  await kudosRouter.setResource('KudosPollFactory', await kudosPollFactory.version(), KudosPollFactory.address);
  await kudosRouter.setResource('KudosTokenFactory', await kudosTokenFactory.version(), KudosTokenFactory.address);

  await deployer.deploy(KudosOrganisations);
};
