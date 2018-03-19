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

      await instance.addMember(accounts[0], 'Test member 0');
      assert.equal(await getMembersNumber(), 1, '1 wasn\'t the members number');
    });

    it('should prevent to add a member twice', async () => {
      const instance = await contract;
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
        await instance.addMember(accounts[3], 'Test member 3', {from: accounts[1]});
      } catch (e) {
        failed = true;
      }
      assert.ok(failed, 'Must throw an error when the a different address than owner adds a new member');
    });

    it('should emit a AddMember event', async () => {
      const instance = await contract;

      const transaction = await instance.addMember(accounts[7], 'Test member 7');
      const {event, args} = transaction.logs[0] || {};

      assert.equal(event, 'AddMember', 'AddMember wasn\'t the event sent');
      assert.equal((args || {}).member, accounts[7], `${accounts[7]} wasn\'t the member`);
    });

    it('should be able to remove members', async () => {
      const instance = await contract;
      const getMembersNumber = async () => +(await instance.membersNumber());

      await instance.addMember(accounts[4], 'Test member 4');
      assert.equal(await getMembersNumber(), 4, '4 wasn\'t the members number');

      await instance.removeMember(accounts[4]);
      assert.equal(await getMembersNumber(), 3, '3 wasn\'t the members number');
    });

    it('should emit a RemoveMember event', async () => {
      const instance = await contract;

      await instance.addMember(accounts[3], 'Test member 3');
      const transaction = await instance.removeMember(accounts[3]);
      const {event, args} = transaction.logs[0] || {};

      assert.equal(event, 'RemoveMember', 'RemoveMember wasn\'t the event sent');
      assert.equal((args || {}).member, accounts[3], `${accounts[3]} wasn\'t the member`);
    });
  });

  // Contacts
  describe('(Contacts)', () => {
    it('should store the contact name of the members', async () => {
      const instance = await contract;
      const contactName = await instance.getContact(accounts[0]);

      assert.equal(contactName, 'Test member 0', `'Test member 0' wasn\'t the event sent`);
    });

    it('should edit contact name of the members', async () => {
      const instance = await contract;

      await instance.editContact(accounts[0], 'Test member edited 0');

      const contactName = await instance.getContact(accounts[0]);

      assert.equal(contactName, 'Test member edited 0', `'Test member edited 0' wasn\'t the event sent`);
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
    let deadline;

    it('should create a new votation', async () => {
      const instance = await contract;

      assert.equal(+(await instance.getVotationsSize()), 0, '0 wasn\'t in the number of votations');

      await instance.newVotation(500, 200, 1);
      deadline = Date.now() + ((1 + 0.5) * 60 * 1000);


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

    it('should set the token name and symbol of the votation', async () => {
      const instance = await contract;
      const kudosVotation = await getKudosVotation(await instance.activeVotation());

      assert.equal(
        await kudosVotation.name(),
        'KudosToken - Votation #1',
        `'KudosToken - Votation #1' wasn't in the number of members`,
      );
      assert.equal(
        await kudosVotation.symbol(),
        'KKT#1',
        `'KKT#1' wasn't in the number of members`,
      );
    });

    it('should add a new member to the current votation', async () => {
      const instance = await contract;
      const kudosVotation = await getKudosVotation(await instance.activeVotation());

      await instance.addMember(accounts[4], 'Test member 4');

      assert.equal(await kudosVotation.membersNumber(), 4, '4 wasn\'t in the number of members');
    });

    it('should be possible to make a votation', async () => {
      const instance = await contract;
      const kudosVotation = await getKudosVotation(await instance.activeVotation());

      await kudosVotation.reward(accounts[1], 100, 'Test message', {from: accounts[0]});
      await kudosVotation.reward(accounts[4], 50, 'Test message', {from: accounts[0]});
      await kudosVotation.reward(accounts[7], 50, 'Test message', {from: accounts[0]});
      await kudosVotation.reward(accounts[0], 150, 'Test message', {from: accounts[1]});
      await kudosVotation.reward(accounts[4], 25, 'Test message', {from: accounts[1]});
      await kudosVotation.reward(accounts[7], 50, 'Test message', {from: accounts[1]});
    });

    it('should close a votation', async () => {
      const instance = await contract;
      const delay = Math.max(deadline - Date.now(), 0);
      const timeout = new Promise(resolve => {
        setTimeout(() => {
          resolve(undefined);
        }, delay);
      });

      await timeout;
      await instance.closeVotation();
      const isActiveVotation = await instance.isActiveVotation();
      assert.ok(!isActiveVotation, `Mustn't be active.`);
    });

    it('should increase the total supply with the kudos sent', async () => {
      const instance = await contract;
      const totalSupply = await instance.totalSupply();

      assert.equal(+totalSupply, 425, '425 wasn\'t in the total supply');
    });

    it('should add the kudos to the members', async () => {
      const instance = await contract;

      assert.equal(+(await instance.balanceOf(accounts[0])), 150, `150 wasn't in the balance of ${accounts[0]}`);
      assert.equal(+(await instance.balanceOf(accounts[1])), 100, `100 wasn't in the balance of ${accounts[0]}`);
      assert.equal(+(await instance.balanceOf(accounts[4])), 75, `75 wasn't in the balance of ${accounts[0]}`);
      assert.equal(+(await instance.balanceOf(accounts[7])), 100, `100 wasn't in the balance of ${accounts[0]}`);
    });
  });
});
