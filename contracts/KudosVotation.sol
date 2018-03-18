pragma solidity ^0.4.18;

import "zeppelin/contracts/math/SafeMath.sol";
import "zeppelin/contracts/token/BurnableToken.sol";
import "zeppelin/contracts/ownership/Ownable.sol";

contract KudosVotation is BurnableToken, Ownable {
  using SafeMath for uint256;

  string public version = "0.0.1";

  struct Gratitude {
    uint256 kudos;
    string message;
    address from;
  }

  struct Result {
    uint256 kudos;
    address member;
  }

  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;

  bool public active;
  uint256 public kudosByMember;
  uint256 public maxKudosToMember;
  address[] public members;
  uint256 public minDeadline;

  mapping (address => uint256) balances;
  mapping (address => mapping (address => uint256)) allowed;

  mapping (address => Gratitude[]) gratitudes;

  event AddMember(address indexed member);
  event Reward(
    address indexed sender,
    address indexed rewarded,
    uint256 kudos,
    string message
  );
  event Close();

  function KudosVotation(
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
    active = true;
  }

  // Lifecircle
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
    Close();
    return true;
  }

  // Members
  function addMember(address _member) onlyActive onlyOwner public returns (bool) {
    require(!isMember(_member));

    members.push(_member);
    balances[_member] = kudosByMember;
    totalSupply += kudosByMember;

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
  }

  // Kudos
  function reward(address _to, uint256 _kudos, string _message) onlyActive public returns (bool) {
    require(isMember(msg.sender));
    require(isMember(_to));
    require(balanceOf(msg.sender) >= _kudos);
    require(_kudos > 0);
    require(_kudos < maxKudosToMember);
    require(bytes(_message).length > 0);

    burn(_kudos);

    gratitudes[_to].push(Gratitude({
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

  function getGratitudesOf(address _member) public constant returns (Gratitude[]) {
    return gratitudes[_member];
  }

  function getGratitudeOf(address _member, uint256 _index) public constant returns (uint256 kudos, string message, address from) {
    Gratitude memory g = getGratitudesOf(_member)[_index];
    return (g.kudos, g.message, g.from);
  }

  function getGratitudesSizeOf(address _member) public constant returns (uint256) {
    return getGratitudesOf(_member).length;
  }

  function getKudosOf(address _member) public constant returns (uint256 kudos) {
    Gratitude[] memory gs = getGratitudesOf(_member);
    kudos = 0;
    for (uint i = 0; i < gs.length; i++) {
      Gratitude memory g = gs[i];
      kudos += g.kudos;
    }
    return kudos;
  }

  // Results
  function getVotationResults() public constant returns (Result[]) {
    Result[] storage results;
    for (uint i = 0; i < members.length; i++) {
      results.push(Result({
        kudos: getKudosOf(members[i]),
        member: members[i]
      }));
    }
    return results;
  }

  function getVotationResult(uint256 _index) public constant returns (address, uint256) {
    Result memory result = getVotationResults()[_index];
    return (result.member, result.kudos);
  }

  function getVotationResultsSize() public constant returns (uint256) {
    return members.length;
  }
}
