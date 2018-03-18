pragma solidity ^0.4.18;

import "zeppelin/contracts/math/SafeMath.sol";
import "zeppelin/contracts/token/StandardToken.sol";
import "zeppelin/contracts/ownership/Ownable.sol";
import "./Kudos.structs.sol";


contract KudosToken is StandardToken, Ownable {
  using SafeMath for uint256;

  string public version = "0.0.1";

  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;

  address[] public members;

  mapping (address => uint256) balances;
  mapping (address => mapping (address => uint256)) allowed;

  event AddMember(address indexed member);

  function KudosToken(
    string _tokenName,
    string _tokenSymbol,
    uint8 _decimalUnits
  ) public {
    name = _tokenName;
    symbol = _tokenSymbol;
    decimals = _decimalUnits;
  }

  // Members
  function addMember(address _member) onlyOwner public returns (bool) {
    require(!isMember(_member));

    members.push(_member);
    AddMember(_member);

    return true;
  }

  function addMembers(address[] _members) onlyOwner public returns (bool) {
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
}
