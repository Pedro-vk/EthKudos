pragma solidity ^0.4.18;


contract InstanceOwnable {
  address public instanceOwner;

  event InstanceOwnershipTransferred(address indexed previousInstanceOwner, address indexed newInstanceOwner);

  function InstanceOwnable() public {
    instanceOwner = msg.sender;
  }

  modifier onlyInstanceOwner() {
    require(msg.sender == instanceOwner);
    _;
  }

  function transferInstanceOwnership(address newInstanceOwner) onlyInstanceOwner public {
    require(newInstanceOwner != address(0));
    InstanceOwnershipTransferred(instanceOwner, newInstanceOwner);
    instanceOwner = newInstanceOwner;
  }

}
