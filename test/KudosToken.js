const KudosToken = artifacts.require('./KudosToken.sol');
const KudosVotation = artifacts.require('./KudosVotation.sol');

contract('KudosToken', accounts => {
  const decimals = 2;

  let contract;

  before(() => {
    contract = KudosToken.new('KudosToken', 'KKT', decimals);
  });

  // Lifecircle - Init
  describe('(Lifecircle - Init)', () => {
    it('should have 0 of total supply', async () => {
      const instance = await contract;
      const totalSupply = await instance.totalSupply();

      assert.equal(+totalSupply, 0, '0 wasn\'t in the total supply');
    });
  });

  // Members
  describe('(Members management)', () => {
    it('should be able to add members', async () => {
      const instance = await contract;
      const getMembersNumber = async () => +(await instance.membersNumber());

      assert.equal(await getMembersNumber(), 0, '0 wasn\'t the members number');

      await instance.addMember(accounts[0]);
      assert.equal(await getMembersNumber(), 1, '1 wasn\'t the members number');
    });

    it('should prevent to add a member twice', async () => {
      const instance = await contract;
      const getMembersNumber = async () => +(await instance.membersNumber());

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
      assert.deepEqual(members, [accounts[0], accounts[1]], `${accounts[0]} and ${accounts[1]} wasn't the members`);
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
      const getMembersNumber = async () => +(await instance.membersNumber());

      assert.equal(await getMembersNumber(), 2, '2 wasn\'t the members number');

      await instance.addMembers([accounts[0], accounts[5], accounts[6]]);
      assert.equal(await getMembersNumber(), 4, '4 wasn\'t the members number');
    });

    it('should emit a AddMember event', async () => {
      const instance = await contract;

      const transaction = await instance.addMember(accounts[7]);
      const {event, args} = transaction.logs[0] || {};

      assert.equal(event, 'AddMember', 'AddMember wasn\'t the event sent');
      assert.equal((args || {}).member, accounts[7], `${accounts[7]} wasn\'t the member`);
    });

    it('should be able to remove members', async () => {
      const instance = await contract;
      const getMembersNumber = async () => +(await instance.membersNumber());

      assert.equal(await getMembersNumber(), 5, '5 wasn\'t the members number');

      await instance.removeMember(accounts[7]);
      assert.equal(await getMembersNumber(), 4, '4 wasn\'t the members number');
    });

    it('should emit a RemoveMember event', async () => {
      const instance = await contract;

      const transaction = await instance.removeMember(accounts[6]);
      const {event, args} = transaction.logs[0] || {};

      assert.equal(event, 'RemoveMember', 'RemoveMember wasn\'t the event sent');
      assert.equal((args || {}).member, accounts[6], `${accounts[6]} wasn\'t the member`);
    });
  });

  // Transfers
  describe('(Transfers)', () => {
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

  // Votations
  describe('(Votations)', () => {
    const getKudosVotation = async address => await KudosVotation.at(address);

    it('should create a new votation', async () => {
      const instance = await contract;

      assert.equal(+(await instance.getVotationsSize()), 0, '0 wasn\'t in the number of votations');

      await instance.newVotation(5, 2, 1);

      assert.equal(+(await instance.getVotationsSize()), 1, '1 wasn\'t in the number of votations');
    });

    it('should know the address of the current votation', async () => {
      const instance = await contract;

      assert.ok(/^0x[0-9a-f]{40}$/.test(await instance.activeVotation()), 'Wasn\'t an address');
    });

    it('should add the members to new votation', async () => {
      const instance = await contract;
      const kudosVotation = await getKudosVotation(await instance.activeVotation());

      assert.equal(await kudosVotation.membersNumber(), 3, '3 wasn\'t in the number of members');
    });

    it('should add a new member to the current votation', async () => {
      const instance = await contract;
      const kudosVotation = await getKudosVotation(await instance.activeVotation());

      await instance.addMember(accounts[4]);

      assert.equal(await kudosVotation.membersNumber(), 4, '4 wasn\'t in the number of members');
    });
  });
});
