import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';

import * as KudosOrganisationsDefinition from '../../../build/contracts/KudosOrganisations.json';

import { SmartContract } from './smart-contract.abstract';
import { Contract } from './truffle.interface';
import { Web3Service, ConnectionStatus } from './web3.service';

interface KudosOrganisationsConstants {
  getOrganisations: string[];
  isInDirectory: boolean;
  organisationIndex: number;
  owner: string;
}
interface KudosOrganisationsActions {
  newOrganisation: boolean;
  removeOrganisation: boolean;
}
interface KudosOrganisationsEvents {
  NewOrganisation: {kudosToken: string};
}
export type KudosOrganisations = KudosOrganisationsActions & KudosOrganisationsConstants & KudosOrganisationsEvents;

Web3Service.addABI(KudosOrganisationsDefinition.abi);

@Injectable()
export class KudosOrganisationsService
  extends SmartContract<KudosOrganisationsConstants, undefined, KudosOrganisationsActions, KudosOrganisationsEvents> {

  // Events
  readonly NewOrganisation$ = this.generateEventObservable('NewOrganisation');

  // Constants
  readonly getOrganisations = () => this.generateConstant('getOrganisations')();
  readonly isInDirectory = (address: string) => this.generateConstant('isInDirectory')(address);
  readonly organisationIndex = (address: string) => this.generateConstant('organisationIndex')(address);
  readonly owner = () => this.generateConstant('owner')();

  // Actions
  readonly newOrganisation =
    (tokenOrganisationName: string, tokenName: string, tokenSymbol: string, decimalUnits: number, addToDirectory: boolean) =>
      this.generateAction('newOrganisation')(tokenOrganisationName, tokenName, tokenSymbol, decimalUnits, addToDirectory)
  readonly removeOrganisation = (address: string) => this.generateAction('removeOrganisation')(address);

  constructor(protected web3Service: Web3Service) {
    super(web3Service);
    this.web3Service
      .status$
      .filter(status => status === ConnectionStatus.Total)
      .first()
      .subscribe(() => {
        const kudosOrganisation = this.getContract(KudosOrganisationsDefinition);

        kudosOrganisation.deployed()
          .then(contract => {
            this.web3Contract = this.getWeb3Contract(KudosOrganisationsDefinition.abi, contract.address);

            this.contract = contract;
            this.initialized = true;
          });
      });
  }

  async imOnwer(): Promise<boolean> {
    const owner = await this.owner();
    const i = await this.web3Service.getAccount().toPromise();
    return owner.toLowerCase() === i.toLowerCase();
  }
}
