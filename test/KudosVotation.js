var KudosVotation = artifacts.require('./KudosVotation.sol');

contract('KudosVotation', accounts => {
  const kudosByMember = 5;
  const maxKudosToMember = 2;

  let contract;

  before(() => {
    contract = KudosVotation.new('Kudos votation #1', 'KV1', 2, kudosByMember, maxKudosToMember);
  });

  // Members
  describe('Members management', () => {
    it('should have 0 of total supply', async () => {
      const instance = await contract;
      const totalSupply = await instance.totalSupply();

      assert.equal(totalSupply.toNumber(), 0, '0 wasn\'t in the total supply');
    });

    it('should be able to add members', async () => {
      const instance = await contract;
      const getMembersNumber = async () => (await instance.membersNumber()).toNumber();

      assert.equal(await getMembersNumber(), 0, '0 wasn\'t the members number');

      await instance.addMember(accounts[0]);
      assert.equal(await getMembersNumber(), 1, '1 wasn\'t the members number');
    });

    it('should add the default amount of Kudos to the new member', async () => {
      const instance = await contract;
      const totalSupply = await instance.totalSupply();

      assert.equal(totalSupply.toNumber(), 5, '5 wasn\'t in the total supply');
    });

    it('should prevent to add a member twice', async () => {
      const instance = await contract;
      const getMembersNumber = async () => (await instance.membersNumber()).toNumber();

      let failed = false;
      try {
        await instance.addMember(accounts[0]);
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when the same memeber is added');

      await instance.addMember(accounts[1]);
      assert.equal(await getMembersNumber(), 2, '2 wasn\'t the members number');
    });

    it('should return the members', async () => {
      const instance = await contract;

      const members = await instance.getMembers();
      assert.deepEqual(members, [accounts[0], accounts[1]], `${accounts[0]} and  ${accounts[1]} wasn't the members`);
    });

    it('should return the members by index', async () => {
      const instance = await contract;

      const member = await instance.getMember(1);
      assert.deepEqual(member, accounts[1], `${accounts[1]} wasn't the member #1`);
    });

    it('should prevent the addition of members if is not the owner', async () => {
      const instance = await contract;
      let failed = false;

      try {
        await instance.addMember(accounts[3], {from: accounts[1]});
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when the a different address than owner adds a new member');
    });

    it('should be able to add multiple members and not fail if one of them exist', async () => {
      const instance = await contract;
      const getMembersNumber = async () => (await instance.membersNumber()).toNumber();

      assert.equal(await getMembersNumber(), 2, '2 wasn\'t the members number');

      await instance.addMembers([accounts[0], accounts[5], accounts[6]]);
      assert.equal(await getMembersNumber(), 4, '4 wasn\'t the members number');
    });
  });

  // Transfers
  describe('Transfers', () => {
    it('should prevent the transfer', async () => {
      const instance = await contract;
      let failed = false;

      try {
        await instance.transfer(accounts[1], 1);
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when transfer');
    });
  });

});
