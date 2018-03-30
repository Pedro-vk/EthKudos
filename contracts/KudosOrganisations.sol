pragma solidity ^0.4.18;

import "zeppelin/contracts/ownership/Ownable.sol";
import "./KudosRouter.sol";
import "./KudosTokenFactory.sol";


contract KudosOrganisations is Ownable {

  address private routerAddress;

  event NewOrganisation(address indexed kudosToken);

  function KudosOrganisations(address _routerAddress) public {
    routerAddress = _routerAddress;
  }

  // Organisations
  function newOrganisation(string _tokenName, string _tokenSymbol, uint8 _decimalUnits) public returns (address) {
    address newKudosTokenAddress = KudosTokenFactory(KudosRouter(routerAddress).getResourceAddress("KudosTokenFactory"))
      .newKudosToken(
        _tokenName,
        _tokenSymbol,
        _decimalUnits,
        routerAddress
      );
    KudosToken(newKudosTokenAddress).transferOwnership(msg.sender);

    NewOrganisation(newKudosTokenAddress);

    return newKudosTokenAddress;
  }

}
