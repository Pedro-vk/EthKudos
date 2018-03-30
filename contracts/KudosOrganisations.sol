pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./KudosRouter.sol";
import "./KudosTokenFactory.sol";


contract KudosOrganisations is Ownable {

  address[] public organisations;

  address private routerAddress;

  event NewOrganisation(address indexed kudosToken);

  function KudosOrganisations(address _routerAddress) public {
    routerAddress = _routerAddress;
  }

  // Organisations
  function newOrganisation(
    string _tokenName,
    string _tokenSymbol,
    uint8 _decimalUnits,
    bool _addToDirectory
  ) public returns (address) {
    address newKudosTokenAddress = KudosTokenFactory(KudosRouter(routerAddress).getResourceAddress("KudosTokenFactory"))
      .newKudosToken(
        _tokenName,
        _tokenSymbol,
        _decimalUnits,
        routerAddress
      );
    KudosToken(newKudosTokenAddress).transferOwnership(msg.sender);

    NewOrganisation(newKudosTokenAddress);

    if (_addToDirectory) {
      organisations.push(newKudosTokenAddress);
    }

    return newKudosTokenAddress;
  }

  function getOrganisations() public constant returns (address[]) {
    return organisations;
  }

  function removeOrganisation(address _organisation) onlyOwner public returns (bool) {
    require(isInDirectory(_organisation));

    uint256 index = organisationIndex(_organisation);

    organisations[index] = organisations[organisations.length - 1];
    organisations.length = organisations.length - 1;

    return true;
  }

  function isInDirectory(address _organisation) public constant returns (bool) {
    for (uint i = 0; i < organisations.length; i++) {
      if (organisations[i] == _organisation) {
        return true;
      }
    }
    return false;
  }

  function organisationIndex(address _organisation) public constant returns (uint256) {
    for (uint i = 0; i < organisations.length; i++) {
      if (organisations[i] == _organisation) {
        return i;
      }
    }
  }
}
