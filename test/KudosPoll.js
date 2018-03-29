const KudosPoll = artifacts.require('KudosPoll');

contract('KudosPoll', accounts => {
  const decimals = 2;
  const kudosByMember = 5 * (10 ** decimals);
  const maxKudosToMember = 2 * (10 ** decimals);
  const deadlineInMin = 1;

  let instance;
  let deadline;

  before(async function() {
    this.timeout(10 * 60 * 1000);

    instance = await KudosPoll.new('Kudos poll Test', 'KVT', decimals, kudosByMember, maxKudosToMember, deadlineInMin);
    deadline = Date.now() + ((deadlineInMin + 0.5) * 60 * 1000);
  });

  // Lifecycle - Init
  describe('(Lifecycle - Init)', function() {
    this.timeout(10 * 60 * 1000);

    it('should not be able to be closed', async () => {
      const canBeClosed = await instance.canBeClosed();

      if (deadline < Date.now()) {
        assert.ok(!canBeClosed, `Can't be closed before the deadline`);
      }
    });

    it('should prevent the closing of the poll', async () => {
      let failed = false;
      try {
        await instance.close();
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when tries to close the poll');
    });
  });

  // Members
  describe('(Members management)', function() {
    this.timeout(10 * 60 * 1000);

    it('should have 0 of total supply', async () => {
      const totalSupply = await instance.totalSupply();

      assert.equal(+totalSupply, 0, '0 wasn\'t in the total supply');
    });

    it('should be able to add members', async () => {
      const getMembersNumber = async () => +(await instance.membersNumber());

      assert.equal(await getMembersNumber(), 0, '0 wasn\'t the members number');

      await instance.addMember(accounts[0]);
      assert.equal(await getMembersNumber(), 1, '1 wasn\'t the members number');
    });

    it('should add the default amount of Kudos to the new member', async () => {
      const totalSupply = await instance.totalSupply();

      assert.equal(+totalSupply, 500, '5.00 wasn\'t in the total supply');
    });

    it('should prevent to add a member twice', async () => {
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
        await instance.addMember(accounts[3], {from: accounts[1]});
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when the a different address than owner adds a new member');
    });

    it('should be able to add multiple members and not fail if one of them exist', async () => {
      const getMembersNumber = async () => +(await instance.membersNumber());

      assert.equal(await getMembersNumber(), 2, '2 wasn\'t the members number');

      await instance.addMembers([accounts[0], accounts[5], accounts[6]]);
      assert.equal(await getMembersNumber(), 4, '4 wasn\'t the members number');
    });

    it('should emit a AddMember event', async () => {
      const transaction = await instance.addMember(accounts[7]);
      const {event, args} = transaction.logs.filter(_ => _.event === 'AddMember')[0] || {};

      assert.equal(event, 'AddMember', 'AddMember wasn\'t the event sent');
      assert.equal((args || {}).member, accounts[7], `${accounts[7]} wasn\'t the member`);
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

  // Kudos
  describe('(Kudos)', function() {
    this.timeout(10 * 60 * 1000);

    it('should be able to send gratitudes', async () => {
      await instance.reward(accounts[1], 100, 'Test message');

      const gratitudesSize = await instance.getGratitudesSizeOf.call(accounts[1]);
      assert.equal(+(gratitudesSize), 1, `1 wasn\'t the number of gratitudes of ${accounts[1]}`);

      const gratitude = await instance.getGratitudeOf.call(accounts[1], 0);
      const [kudos, message, fromAddress] = gratitude;

      assert.equal(kudos, 100, `1.00 wasn\'t the kudos sent`);
      assert.equal(message, 'Test message', `'Test message' wasn\'t the message sent`);
      assert.equal(fromAddress, accounts[0], `${accounts[0]} wasn\'t the sender`);
    });

    it('should burn the kudos sent', async () => {
      const initialBalance = +(await instance.balanceOf.call(accounts[0]));

      await instance.reward(accounts[1], 50, 'Test message');

      const finalBalance = +(await instance.balanceOf.call(accounts[0]));

      assert.equal(finalBalance - initialBalance, -50, `-0.5 wasn\'t the balance change`);
    });

    it('should prevent to reward with more kudos than max. defined', async () => {
      let failed = false;

      try {
        await instance.reward(accounts[1], 250, 'Test message');
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when send more kudos than max.');
    });

    it('should know the total number of kudos of a member', async () => {
      await instance.reward(accounts[5], 100, 'Test message', {from: accounts[1]});
      await instance.reward(accounts[5], 50, 'Test message', {from: accounts[1]});
      await instance.reward(accounts[5], 25, 'Test message', {from: accounts[1]});

      const kudos = await instance.getKudosOf.call(accounts[5]);

      assert.equal(+kudos, 175, `1.75 wasn\'t the total of kudos`);
    });

    it('should emit a Reward event', async () => {
      const transaction = await instance.reward(accounts[0], 30, 'Test message', {from: accounts[1]});
      const {event, args} = transaction.logs.filter(_ => _.event === 'Reward')[0] || {};

      assert.equal(event, 'Reward', 'Reward wasn\'t the event sent');
      assert.equal((args || {}).sender, accounts[1], `${accounts[1]} wasn\'t the sender`);
      assert.equal((args || {}).rewarded, accounts[0], `${accounts[0]} wasn\'t the rewarded`);
      assert.equal((args || {}).kudos, 30, `30 wasn\'t the kudos`);
      assert.equal((args || {}).message, 'Test message', `'Test message' wasn\'t the message`);
    });

    it('should know the number of Kudos sent from a member to other member', async () => {
      const kudos = await instance.getKudosSentFromTo.call(accounts[1], accounts[5]);

      assert.equal(+kudos, 175, `1.75 wasn\'t the total of kudos`);
    });

    it('should prevent to reward with more kudos than max. defined on different rewards', async () => {
      let failed = false;

      try {
        await instance.reward(accounts[5], 100, 'Test message', {from: accounts[1]});
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when send more kudos than max.');
    });
  });

  // Results
  describe('(Results)', function() {
    this.timeout(10 * 60 * 1000);

    it('should generate the list of results', async () => {
      const resultsPromises = Array.from(new Array(+(await instance.getPollResultsSize())))
        .map((_, i) => instance.getPollResult(i));
      const results = (await Promise.all(resultsPromises))
        .map(([member, kudos]) => ({member, kudos: +kudos}))
        .sort((a, b) => b.kudos - a.kudos);

      const compared = [
        {member: accounts[5], kudos: 175},
        {member: accounts[1], kudos: 150},
        {member: accounts[0], kudos: 30},
        {member: accounts[6], kudos: 0},
        {member: accounts[7], kudos: 0}
      ];

      assert.deepEqual(results, compared, `The results wasn\'t the expected`);
    });
  });

  // Lifecycle - End
  describe('(Lifecycle - End)', function() {
    this.timeout(10 * 60 * 1000);

    it('should be able to be closed', async () => {
      const delay = Math.max(deadline - Date.now(), 0);
      const timeout = new Promise(resolve => {
        setTimeout(() => {
          resolve(undefined);
        }, delay);
      });

      await timeout;
      const canBeClosed = await instance.canBeClosed();
      assert.ok(canBeClosed, `Can be closed before the deadline`);
    });

    it('should prevent to close the poll if is not the owner', async () => {
      let failed = false;

      try {
        await instance.close({from: accounts[1]});
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when tries to close');
    });

    it('should be able to close the poll and send a Close event', async () => {
      const transaction = await instance.close();
      const {event} = transaction.logs.filter(_ => _.event === 'Close')[0] || {};

      assert.equal(event, 'Close', 'Close wasn\'t the event sent');
    });

    it('should prevent the addition of a new member if is closed', async () => {
      let failed = false;

      try {
        await instance.addMember(accounts[2]);
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when tries to add a new member');
    });
  });
});
