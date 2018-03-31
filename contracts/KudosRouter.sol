pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract KudosRouter is Ownable {
  struct Resource {
    string version;
    address at;
  }

  mapping (string => Resource) resources;

  event ResourceUpdate(string resource);

  function KudosRouter() public { }

  function setResource(string _resource, string _version, address _at) onlyOwner public returns (bool) {
    resources[_resource] = Resource({version: _version, at: _at});

    ResourceUpdate(_resource);

    return true;
  }

  function getResource(string _resource) public constant returns (string version, address at) {
    require(resources[_resource].at != address(0));

    return (resources[_resource].version, resources[_resource].at);
  }

  function getResourceAddress(string _resource) public constant returns (address at) {
    require(resources[_resource].at != address(0));

    return resources[_resource].at;
  }
}
