var KudosVotation = artifacts.require("./KudosVotation.sol");

module.exports = function(deployer) {
  deployer.deploy(KudosVotation, 'Kudos votation #1', 'KV1', 2, 5, 2);
};
