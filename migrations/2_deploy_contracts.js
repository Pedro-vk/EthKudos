const KudosToken = artifacts.require("KudosToken");
const KudosRouter = artifacts.require("KudosRouter");
const KudosPollFactory = artifacts.require("KudosPollFactory");
const KudosStruct = artifacts.require("KudosStructs");
const StringUtils = artifacts.require("StringUtils");

module.exports = async function(deployer) {
  await deployer.deploy(KudosStruct);
  deployer.link(KudosStruct, [KudosToken, KudosPollFactory]);
  await deployer.deploy(StringUtils);
  deployer.link(StringUtils, [KudosToken, KudosPollFactory]);

  await deployer.deploy(KudosPollFactory);
  deployer.link(KudosPollFactory, KudosToken);

  await deployer.deploy(KudosRouter);
  deployer.link(KudosRouter, KudosToken);

  const kudosPollFactory = await KudosPollFactory.deployed();
  const kudosRouter = await KudosRouter.deployed();

  await kudosRouter.setResource('KudosPollFactory', await kudosPollFactory.version(), KudosPollFactory.address);

  await deployer.deploy(KudosToken, 'ACMECompany Kudos', 'ACMEK', 2, KudosRouter.address);
};
