pragma solidity ^0.4.18;

import "zeppelin/contracts/ownership/Ownable.sol";


contract KudosUpdateCenter is Ownable {
  struct Resource {
    string version;
    address at;
  }

  mapping (string => Resource) resources;

  function KudosUpdateCenter() public { }

  function setResource(string _resource, string _version, address _at) onlyOwner public returns (bool) {
    resources[_resource] = Resource({version: _version, at: _at});
    return true;
  }

  function getResource(string _resource) public constant returns (string version, address at) {
    require(resources[_resource].at != address(0));

    return (resources[_resource].version, resources[_resource].at);
  }
}
