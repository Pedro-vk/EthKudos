pragma solidity ^0.4.18;
pragma experimental "ABIEncoderV2";

import "zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Kudos.structs.sol";


contract KudosPollFactory {
  string public version = "0.1";

  function KudosPollFactory() public { }

  function newKudosPoll(
    string _tokenName,
    string _tokenSymbol,
    uint8 _decimalUnits,
    uint256 _kudosByMember,
    uint256 _maxKudosToMember,
    uint256 _minDurationInMinutes
  ) public returns (address kudosPollAddress) {
    address kudosPoll = new KudosPoll(
      _tokenName,
      _tokenSymbol,
      _decimalUnits,
      _kudosByMember,
      _maxKudosToMember,
      _minDurationInMinutes
    );
    KudosPoll(kudosPoll).transferOwnership(msg.sender);
    return kudosPoll;
  }
}


contract KudosPoll is BurnableToken, Ownable {
  string public version = "0.1";

  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;

  bool public active;
  uint256 public kudosByMember;
  uint256 public maxKudosToMember;
  address[] public members;
  uint256 public minDeadline;
  uint256 public creation;

  mapping (address => uint256) balances;
  mapping (address => mapping (address => uint256)) allowed;

  mapping (address => KudosStructs.Gratitude[]) gratitudes;

  event AddMember(address indexed member);
  event Reward(
    address indexed sender,
    address indexed rewarded,
    uint256 kudos,
    string message
  );
  event Close();

  function KudosPoll(
    string _tokenName,
    string _tokenSymbol,
    uint8 _decimalUnits,
    uint256 _kudosByMember,
    uint256 _maxKudosToMember,
    uint256 _minDurationInMinutes
  ) public {
    name = _tokenName;
    symbol = _tokenSymbol;
    decimals = _decimalUnits;
    kudosByMember = _kudosByMember;
    maxKudosToMember = _maxKudosToMember;
    minDeadline = now + (_minDurationInMinutes * 1 minutes);
    creation = now;
    active = true;
  }

  // lifecycle
  modifier onlyActive() {
    require(active);
    _;
  }

  function canBeClosed() public constant returns (bool) {
    return minDeadline < now;
  }

  function close() onlyActive onlyOwner public returns (bool) {
    require (canBeClosed());
    active = false;

    for (uint i = 0; i < members.length; i++) {
      Transfer(members[i], address(0), balances[members[i]]);
      Burn(members[i], balances[members[i]]);
      balances[members[i]] = 0;
    }

    totalSupply = 0;

    Close();
    return true;
  }

  // Members
  function addMember(address _member) onlyActive onlyOwner public returns (bool) {
    require(!isMember(_member));

    members.push(_member);
    balances[_member] = kudosByMember;
    totalSupply += kudosByMember;

    Transfer(address(0), _member, kudosByMember);
    AddMember(_member);

    return true;
  }

  function addMembers(address[] _members) onlyActive onlyOwner public returns (bool) {
    require(_members.length > 0);
    for (uint i = 0; i < _members.length; i++) {
      if (!isMember(_members[i])) {
        addMember(_members[i]);
      }
    }
    return true;
  }

  function isMember(address _member) public constant returns (bool) {
    for (uint i = 0; i < members.length; i++) {
      if (members[i] == _member) {
        return true;
      }
    }
    return false;
  }

  function getMembers() public constant returns (address[]) {
    return members;
  }

  function getMember(uint256 _index) public constant returns (address) {
    return members[_index];
  }

  function membersNumber() public constant returns (uint256) {
    return members.length;
  }

  // Transfers
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(false && _to == 0x0 && _value == 0);
  }

  function balanceOf(address _owner) public constant returns (uint256 balance) {
    return balances[_owner];
  }

  function burn(uint256 _value) onlyActive public {
    require(_value > 0);
    require(balances[msg.sender] >= _value);

    balances[msg.sender] -= _value;
    totalSupply -= _value;

    Burn(msg.sender, _value);
    Transfer(msg.sender, address(0), _value);
  }

  // Kudos
  function reward(address _to, uint256 _kudos, string _message) onlyActive public returns (bool) {
    require(isMember(msg.sender));
    require(isMember(_to));
    require(msg.sender != _to);
    require(balanceOf(msg.sender) >= _kudos);
    require(_kudos > 0);
    require(_kudos <= maxKudosToMember);
    require((getKudosSentFromTo(msg.sender, _to) + _kudos) <= maxKudosToMember);
    require(bytes(_message).length > 0);

    burn(_kudos);

    gratitudes[_to].push(KudosStructs.Gratitude({
      kudos: _kudos,
      message: _message,
      from: msg.sender
    }));

    Reward(
      msg.sender,
      _to,
      _kudos,
      _message
    );

    return true;
  }

  function getGratitudesOf(address _member) public constant returns (KudosStructs.Gratitude[] gratitudesList) {
    return gratitudes[_member];
  }

  function getGratitudeOf(address _member, uint256 _index) public constant returns (uint256 kudos, string message, address from) {
    KudosStructs.Gratitude memory g = getGratitudesOf(_member)[_index];
    return (g.kudos, g.message, g.from);
  }

  function getGratitudesSizeOf(address _member) public constant returns (uint256) {
    return getGratitudesOf(_member).length;
  }

  function getKudosOf(address _member) public constant returns (uint256 kudos) {
    KudosStructs.Gratitude[] memory gs = getGratitudesOf(_member);
    kudos = 0;
    for (uint i = 0; i < gs.length; i++) {
      KudosStructs.Gratitude memory g = gs[i];
      kudos += g.kudos;
    }
    return kudos;
  }

  function getKudosSentFromTo(address _from, address _to) public constant returns (uint256 kudos) {
    KudosStructs.Gratitude[] memory gs = getGratitudesOf(_to);
    kudos = 0;
    for (uint i = 0; i < gs.length; i++) {
      KudosStructs.Gratitude memory g = gs[i];
      if (g.from == _from) {
        kudos += g.kudos;
      }
    }
    return kudos;
  }

  // Results
  function getPollResults() public constant returns (KudosStructs.Result[] resultsList) {
    KudosStructs.Result[] memory results = new KudosStructs.Result[](members.length);
    for (uint i = 0; i < members.length; i++) {
      results[i] = KudosStructs.Result({
        kudos: getKudosOf(members[i]),
        member: members[i]
      });
    }
    return results;
  }

  function getPollResult(uint256 _index) public constant returns (address member, uint256 kudos) {
    KudosStructs.Result memory result = getPollResults()[_index];
    return (result.member, result.kudos);
  }

  function getPollResultsSize() public constant returns (uint256) {
    return members.length;
  }
}
