pragma solidity ^0.4.18;

import "zeppelin/contracts/math/SafeMath.sol";
import "zeppelin/contracts/token/BurnableToken.sol";
import "zeppelin/contracts/ownership/Ownable.sol";


contract KudosVotation is BurnableToken, Ownable {

  using SafeMath for uint256;

  string public version = "0.0.1";

  string public name;
  string public symbol;
  uint8 public decimals;
  uint256 public totalSupply;

  uint256 public kudosByMember;
  uint256 public maxKudosToMember;
  address[] public members;

  mapping (address => uint256) balances;
  mapping (address => mapping (address => uint256)) allowed;

  event AddMember(address indexed member);

  function KudosVotation(
    string _tokenName,
    string _tokenSymbol,
    uint8 _decimalUnits,
    uint256 _kudosByMember,
    uint256 _maxKudosToMember
  ) public {
    name = _tokenName;
    symbol = _tokenSymbol;
    decimals = _decimalUnits;
    kudosByMember = _kudosByMember;
    maxKudosToMember = _maxKudosToMember;
  }

  function addMember(address _member) onlyOwner public returns (bool) {
    require(!isMember(_member));

    members.push(_member);
    balances[_member] = kudosByMember;
    totalSupply += kudosByMember;
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
}
