const KudosOrganisations = artifacts.require('./KudosOrganisations.sol');
const KudosRouter = artifacts.require('KudosRouter');
const KudosTokenFactory = artifacts.require('KudosTokenFactory');
const KudosToken = artifacts.require('KudosToken');
const KudosPollFactory = artifacts.require('KudosPollFactory');

contract('KudosOrganisations', accounts => {
  let instance;

  before(async function() {
    this.timeout(10 * 60 * 1000);

    kudosPollFactory = (await KudosPollFactory.new()).address;
    kudosTokenFactory = (await KudosTokenFactory.new()).address;

    kudosRouterInstance = await KudosRouter.new();
    await kudosRouterInstance.setResource('KudosPollFactory', '0.0-test.1', kudosPollFactory);
    await kudosRouterInstance.setResource('KudosTokenFactory', '0.0-test.1', kudosTokenFactory);

    instance = await KudosOrganisations.new(kudosRouterInstance.address);
  });

  // Organisation
  describe('(Organisation)', function() {
    this.timeout(10 * 60 * 1000);

    it('should be able to create a new organisation / token', async () => {
      const tx = await instance.newOrganisation('TestCompany Kudos', 'TCK', 3);
      const kudosTokenAddress = tx.logs.filter(_ => _.event === 'NewOrganisation').pop().args.kudosToken;
      const kudosTokenInstance = await KudosToken.at(kudosTokenAddress);

      assert.equal(await kudosTokenInstance.name(), 'TestCompany Kudos', `'TestCompany Kudos' wasn't the token name`);
      assert.equal(await kudosTokenInstance.symbol(), 'TCK', `'TCK' wasn't the token symbol`);
      assert.equal(await kudosTokenInstance.decimals(), 3, `3 wasn't the token decimals`);
    });
  });
});
