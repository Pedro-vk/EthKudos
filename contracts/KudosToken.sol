pragma solidity ^0.4.18;

import "zeppelin/contracts/math/SafeMath.sol";
import "zeppelin/contracts/token/StandardToken.sol";
import "zeppelin/contracts/ownership/Ownable.sol";
import "./string-utils.sol";
import "./Kudos.structs.sol";
import "./KudosVotation.sol";


contract KudosToken is StandardToken, Ownable {
  using SafeMath for uint256;

  string public version = "0.0.1";

  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;

  address[] public members;
  mapping (address => string) public contacts;

  address[] public votations;
  bool public isActiveVotation = false;

  mapping (address => uint256) balances;
  mapping (address => mapping (address => uint256)) allowed;

  event AddMember(address indexed member);
  event RemoveMember(address indexed member);
  event NewVotation(address indexed votation);
  event CloseVotation(address indexed votation);

  function KudosToken(
    string _tokenName,
    string _tokenSymbol,
    uint8 _decimalUnits
  ) public {
    name = _tokenName;
    symbol = _tokenSymbol;
    decimals = _decimalUnits;
  }

  // Votations
  function newVotation(
    uint256 _kudosByMember,
    uint256 _maxKudosToMember,
    uint256 _minDurationInMinutes
  ) onlyOwner public returns (address) {
    require (!isActiveVotation);

    string memory number = uint2str(votations.length + 1);
    address newVotationAddress = new KudosVotation(
      StringUtils.strConcat(name, " - Votation #", number),
      StringUtils.strConcat(symbol, "#", number),
      decimals,
      _kudosByMember,
      _maxKudosToMember,
      _minDurationInMinutes
    );

    votations.push(newVotationAddress);
    isActiveVotation = true;

    KudosVotation newVotation = KudosVotation(newVotationAddress);
    newVotation.addMembers(members);

    NewVotation(newVotationAddress);

    return newVotationAddress;
  }

  function closeVotation() onlyOwner public returns (bool) {
    require(isActiveVotation);

    KudosVotation currentVotation = KudosVotation(activeVotation());
    require(currentVotation.canBeClosed());

    currentVotation.close();
    isActiveVotation = false;

    for (uint i = 0; i < currentVotation.getVotationResultsSize(); i++) {
      var (member, kudos) = currentVotation.getVotationResult(i);
      addKudos(member, kudos);
    }

    return true;
  }

  function activeVotation() public constant returns (address) {
    if (isActiveVotation) {
      return votations[votations.length - 1];
    }
  }

  function getVotations() public constant returns (address[]) {
    return votations;
  }

  function getVotationsSize() public constant returns (uint256) {
    return votations.length;
  }

  // Kudos balances
  function addKudos(address _member, uint256 _kudos) onlyOwner public returns (bool) {
    balances[_member] += _kudos;
    totalSupply += _kudos;
    return true;
  }

  // Members
  function addMember(address _member, string _contact) onlyOwner public returns (bool) {
    require(!isMember(_member));

    members.push(_member);
    contacts[_member] = _contact;
    AddMember(_member);

    if (isActiveVotation) {
      KudosVotation currentVotation = KudosVotation(activeVotation());
      currentVotation.addMember(_member);
    }

    return true;
  }

  function removeMember(address _member) onlyOwner public returns (bool) {
    require(isMember(_member));

    uint256 index = memberIndex(_member);

    members[index] = members[members.length - 1];
    members.length = members.length - 1;
    RemoveMember(_member);

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

  function memberIndex(address _member) public constant returns (uint256) {
    for (uint i = 0; i < members.length; i++) {
      if (members[i] == _member) {
        return i;
      }
    }
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

  // Contacts
  function editContact(address _member, string _contact) onlyOwner public returns (bool) {
    require(isMember(_member));

    contacts[_member] = _contact;

    return true;
  }

  function getContact(address _member) public constant returns (string) {
    if (isMember(_member)) {
      return contacts[_member];
    }
  }

  // Transfers
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(false && _to == 0x0 && _value == 0);
  }

  function balanceOf(address _owner) public constant returns (uint256 balance) {
    return balances[_owner];
  }

  // Utils
  function uint2str(uint i) internal pure returns (string) {
    if (i == 0) return "0";
    uint j = i;
    uint length;
    while (j != 0){
      length++;
      j /= 10;
    }
    bytes memory bstr = new bytes(length);
    uint k = length - 1;
    while (i != 0){
      bstr[k--] = byte(48 + i % 10);
      i /= 10;
    }
    return string(bstr);
  }
}
