const KudosToken = artifacts.require("KudosToken");
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

  await deployer.deploy(KudosToken, 'ACMECompany Kudos', 'ACMEK', 2, KudosPollFactory.address);
};
