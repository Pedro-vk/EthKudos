const KudosToken = artifacts.require('./KudosToken.sol');
const KudosPoll = artifacts.require('./KudosPoll.sol');

contract('KudosToken', accounts => {
  const decimals = 2;

  let instance;

  before(async function() {
    this.timeout(10 * 60 * 1000);

    instance = await KudosToken.new('KudosToken', 'KKT', decimals);
  });

  // Lifecycle - Init
  describe('(Lifecycle - Init)', function() {
    this.timeout(10 * 60 * 1000);

    it('should have 0 of total supply', async () => {
      const totalSupply = await instance.totalSupply();

      assert.equal(+totalSupply, 0, '0 wasn\'t in the total supply');
    });
  });

  // Ownership
  describe('(Ownership)', function() {
    this.timeout(10 * 60 * 1000);

    it('should have as onwer the contract deployer', async () => {
      const owner = await instance.owner();

      assert.equal(owner, accounts[0], `${accounts[0]} wasn't the owner`);
    });

    it('should transfer the ownership', async () => {
      await instance.transferOwnership(accounts[1]);
      assert.equal(await instance.owner(), accounts[1], `${accounts[1]} wasn't the owner`);

      await instance.transferOwnership(accounts[0], {from: accounts[1]});
      assert.equal(await instance.owner(), accounts[0], `${accounts[0]} wasn't the owner`);
    });
  });

  // Members
  describe('(Members management)', function() {
    this.timeout(10 * 60 * 1000);

    it('should be able to add members', async () => {
      const getMembersNumber = async () => +(await instance.membersNumber());

      assert.equal(await getMembersNumber(), 0, '0 wasn\'t the members number');

      await instance.addMember(accounts[0], 'Test member 0');
      assert.equal(await getMembersNumber(), 1, '1 wasn\'t the members number');
    });

    it('should prevent to add a member twice', async () => {
      const getMembersNumber = async () => +(await instance.membersNumber());

      let failed = false;
      try {
        await instance.addMember(accounts[0], 'Test member 0');
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when the same memeber is added');

      await instance.addMember(accounts[1], 'Test member 1');
      assert.equal(await getMembersNumber(), 2, '2 wasn\'t the members number');
    });

    it('should return the members', async () => {
      const members = await instance.getMembers();
      assert.deepEqual(members, [accounts[0], accounts[1]], `${accounts[0]} and ${accounts[1]} wasn't the members`);
    });

    it('should return the members by index', async () => {
      const member = await instance.getMember(1);
      assert.deepEqual(member, accounts[1], `${accounts[1]} wasn't the member #1`);
    });

    it('should prevent the addition of members if is not the owner', async () => {
      let failed = false;

      try {
        await instance.addMember(accounts[3], 'Test member 3', {from: accounts[1]});
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when the a different address than owner adds a new member');
    });

    it('should emit a AddMember event', async () => {
      const transaction = await instance.addMember(accounts[7], 'Test member 7');
      const {event, args} = transaction.logs[0] || {};

      assert.equal(event, 'AddMember', 'AddMember wasn\'t the event sent');
      assert.equal((args || {}).member, accounts[7], `${accounts[7]} wasn\'t the member`);
    });

    it('should be able to remove members', async () => {
      const getMembersNumber = async () => +(await instance.membersNumber());

      await instance.addMember(accounts[4], 'Test member 4');
      assert.equal(await getMembersNumber(), 4, '4 wasn\'t the members number');

      await instance.removeMember(accounts[4]);
      assert.equal(await getMembersNumber(), 3, '3 wasn\'t the members number');
    });

    it('should emit a RemoveMember event', async () => {
      await instance.addMember(accounts[3], 'Test member 3');
      const transaction = await instance.removeMember(accounts[3]);
      const {event, args} = transaction.logs[0] || {};

      assert.equal(event, 'RemoveMember', 'RemoveMember wasn\'t the event sent');
      assert.equal((args || {}).member, accounts[3], `${accounts[3]} wasn\'t the member`);
    });
  });

  // Contacts
  describe('(Contacts)', function() {
    this.timeout(10 * 60 * 1000);

    it('should store the contact name of the members', async () => {
      const contactName = await instance.getContact(accounts[0]);

      assert.equal(contactName, 'Test member 0', `'Test member 0' wasn\'t the event sent`);
    });

    it('should edit contact name of the members', async () => {
      await instance.editContact(accounts[0], 'Test member edited 0');

      const contactName = await instance.getContact(accounts[0]);

      assert.equal(contactName, 'Test member edited 0', `'Test member edited 0' wasn\'t the event sent`);
    });
  });

  // Transfers
  describe('(Transfers)', function() {
    this.timeout(10 * 60 * 1000);

    it('should prevent the transfer', async () => {
      let failed = false;

      try {
        await instance.transfer(accounts[1], 1);
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when transfer');
    });
  });

  // Polls
  describe('(Polls)', function() {
    this.timeout(10 * 60 * 1000);

    const getKudosPoll = async address => await KudosPoll.at(address);
    let deadline;

    it('should create a new poll', async () => {
      assert.equal(+(await instance.getPollsSize()), 0, '0 wasn\'t in the number of polls');

      await instance.newPoll(500, 200, 1);
      deadline = Date.now() + ((1 + 0.5) * 60 * 1000);


      assert.equal(+(await instance.getPollsSize()), 1, '1 wasn\'t in the number of polls');
    });

    it('should know the address of the current poll', async () => {
      assert.ok(/^0x[0-9a-f]{40}$/.test(await instance.activePoll()), 'Wasn\'t an address');
    });

    it('should add the members to new poll', async () => {
      const kudosPoll = await getKudosPoll(await instance.activePoll());

      assert.equal(await kudosPoll.membersNumber(), 3, '3 wasn\'t in the number of members');
    });

    it('should set the token name and symbol of the poll', async () => {
      const kudosPoll = await getKudosPoll(await instance.activePoll());

      assert.equal(
        await kudosPoll.name(),
        'KudosToken - Poll #1',
        `'KudosToken - Poll #1' wasn't in the number of members`,
      );
      assert.equal(
        await kudosPoll.symbol(),
        'KKT#1',
        `'KKT#1' wasn't in the number of members`,
      );
    });

    it('should add a new member to the current poll', async () => {
      const kudosPoll = await getKudosPoll(await instance.activePoll());

      await instance.addMember(accounts[4], 'Test member 4');

      assert.equal(await kudosPoll.membersNumber(), 4, '4 wasn\'t in the number of members');
    });

    it('should be possible to make a poll', async () => {
      const kudosPoll = await getKudosPoll(await instance.activePoll());

      await kudosPoll.reward(accounts[1], 100, 'Test message', {from: accounts[0]});
      await kudosPoll.reward(accounts[4], 50, 'Test message', {from: accounts[0]});
      await kudosPoll.reward(accounts[7], 50, 'Test message', {from: accounts[0]});
      await kudosPoll.reward(accounts[0], 150, 'Test message', {from: accounts[1]});
      await kudosPoll.reward(accounts[4], 25, 'Test message', {from: accounts[1]});
      await kudosPoll.reward(accounts[7], 50, 'Test message', {from: accounts[1]});
    });

    it('should close a poll', async () => {
      const delay = Math.max(deadline - Date.now(), 0);
      const timeout = new Promise(resolve => {
        setTimeout(() => {
          resolve(undefined);
        }, delay);
      });

      await timeout;
      await instance.closePoll();
      const isActivePoll = await instance.isActivePoll();
      assert.ok(!isActivePoll, `Mustn't be active.`);
    });

    it('should increase the total supply with the kudos sent', async () => {
      const totalSupply = await instance.totalSupply();

      assert.equal(+totalSupply, 425, '425 wasn\'t in the total supply');
    });

    it('should add the kudos to the members', async () => {
      assert.equal(+(await instance.balanceOf(accounts[0])), 150, `150 wasn't in the balance of ${accounts[0]}`);
      assert.equal(+(await instance.balanceOf(accounts[1])), 100, `100 wasn't in the balance of ${accounts[0]}`);
      assert.equal(+(await instance.balanceOf(accounts[4])), 75, `75 wasn't in the balance of ${accounts[0]}`);
      assert.equal(+(await instance.balanceOf(accounts[7])), 100, `100 wasn't in the balance of ${accounts[0]}`);
    });

    it('should create a new poll before close the previous one', async () => {
      assert.equal(+(await instance.getPollsSize()), 1, '1 wasn\'t in the number of polls');

      await instance.newPoll(500, 200, 1);
      deadline = Date.now() + ((1 + 0.5) * 60 * 1000);

      assert.equal(+(await instance.getPollsSize()), 2, '2 wasn\'t in the number of polls');
    });

    it('should keep all the pools', async () => {
      const polls = await instance.getPolls();

      assert.equal(polls.length, 2, '2 wasn\'t in the number of polls');
      assert.equal(polls[1], await instance.activePoll(), 'Active poll address wasn\'t the last on the list');
    });
  });
});
