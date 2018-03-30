const KudosRouter = artifacts.require('KudosRouter');

contract('KudosRouter', accounts => {
  let instance;

  before(async function() {
    this.timeout(10 * 60 * 1000);

    instance = await KudosRouter.new();
  });

  // Resources
  describe('(Resources)', function() {
    this.timeout(10 * 60 * 1000);

    it('should be able to set a resource', async () => {
      await instance.setResource('Test', '0.1', '0x0000000000000000000000000000000000000001');
    });

    it('should be able to get a resource', async () => {
      const [version, at] = await instance.getResource('Test');

      assert.equal(at, '0x0000000000000000000000000000000000000001', 'Must be 1 the address of the resource');
      assert.equal(version, '0.1', 'Must be 0.1 the version of the resource');
    });

    it('should not return a resource if it doesn\'t exist', async () => {
      let failed = false;
      try {
        await instance.getResource('NotFound');
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error if the resource doesn\'t exist');
    });

    it('should prevent to set a resource if is not the owner', async () => {
      let failed = false;
      try {
        await instance.setResource('Test2', '0.1', '0x0000000000000000000000000000000000000001', {from: accounts[1]});
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error if is not the owner');
    });

    it('should be able to overwrite a resource', async () => {
      await instance.setResource('Test', '0.2', '0x0000000000000000000000000000000000000002');

      const [version, at] = await instance.getResource('Test');

      assert.equal(at, '0x0000000000000000000000000000000000000002', 'Must be 2 the address of the resource');
      assert.equal(version, '0.2', 'Must be 0.2 the version of the resource');
    });
  });
});
