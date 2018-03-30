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

    const kudosRouterAddress = kudosRouterInstance.address;

    instance = await KudosOrganisations.new(kudosRouterAddress);
  });

  // Organisation
  describe('(Organisation)', function() {
    this.timeout(10 * 60 * 1000);

    it('should be able to create a new organisation / token', async () => {
      const tx = await instance.newOrganisation('TestCompany Kudos', 'TCK', 3, false);
      const kudosTokenAddress = tx.logs.filter(_ => _.event === 'NewOrganisation').pop().args.kudosToken;
      const kudosTokenInstance = await KudosToken.at(kudosTokenAddress);

      assert.equal(await kudosTokenInstance.name(), 'TestCompany Kudos', `'TestCompany Kudos' wasn't the token name`);
      assert.equal(await kudosTokenInstance.symbol(), 'TCK', `'TCK' wasn't the token symbol`);
      assert.equal(await kudosTokenInstance.decimals(), 3, `3 wasn't the token decimals`);
    });

    it('should add organisations to the directory', async () => {
      assert.equal((await instance.getOrganisations()).length, 0, '0 wasn\'t the number of organisations');

      const tx = await instance.newOrganisation('TestCompanyOnDirectory Kudos', 'TCDK', 3, true);
      const kudosTokenAddress = tx.logs.filter(_ => _.event === 'NewOrganisation').pop().args.kudosToken;

      assert.equal((await instance.getOrganisations()).length, 1, '1 wasn\'t the number of organisations');
      assert.equal((await instance.getOrganisations())[0], kudosTokenAddress, `${kudosTokenAddress} wasn\'t the number of organisations`);
    });

    it('should be able to remove an organisation', async () => {
      assert.equal((await instance.getOrganisations()).length, 1, '1 wasn\'t the number of organisations');

      const tx = await instance.newOrganisation('Remove Kudos', 'RK', 5, true);
      const kudosTokenAddress = tx.logs.filter(_ => _.event === 'NewOrganisation').pop().args.kudosToken;

      assert.equal((await instance.getOrganisations()).length, 2, '2 wasn\'t the number of organisations');

      await instance.removeOrganisation(kudosTokenAddress);

      assert.equal((await instance.getOrganisations()).length, 1, '1 wasn\'t the number of organisations');
    });

    it('should prevent to remove an organisation if is not the owner', async () => {
      assert.equal((await instance.getOrganisations()).length, 1, '1 wasn\'t the number of organisations');

      const tx = await instance.newOrganisation('Remove Kudos', 'RK', 5, true);
      const kudosTokenAddress = tx.logs.filter(_ => _.event === 'NewOrganisation').pop().args.kudosToken;

      assert.equal((await instance.getOrganisations()).length, 2, '2 wasn\'t the number of organisations');

      let failed = false;
      try {
        await instance.removeOrganisation(kudosTokenAddress, {from: accounts[1]});
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when tries to remove an organization');
      assert.equal((await instance.getOrganisations()).length, 2, '2 wasn\'t the number of organisations');
    });
  });
});
