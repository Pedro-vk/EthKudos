var KudosToken = artifacts.require("./KudosToken.sol");

module.exports = function(deployer) {
  deployer.deploy(KudosToken, 'ACMECompany Kudos', 'ACMEK', 2);
};
