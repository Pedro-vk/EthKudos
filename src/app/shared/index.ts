export * from './is-owner.guard';
export * from './is-token.guard';
export * from './kudos-organisations.service';
export * from './kudos-poll-factory.service';
export * from './kudos-poll.service';
export * from './kudos-token-factory.service';
export * from './kudos-token.service';
export * from './web3.service';

import { IsOwnerGuard } from './is-owner.guard';
import { IsTokenGuard } from './is-token.guard';
import { KudosOrganisationsService } from './kudos-organisations.service'
import { KudosPollFactoryService } from './kudos-poll-factory.service';
import { KudosTokenFactoryService } from './kudos-token-factory.service';
import { Web3Service } from './web3.service';

import { KudosTokenService } from './kudos-token.service';

export const PROVIDERS = [
  IsOwnerGuard,
  IsTokenGuard,
  Web3Service,
  KudosOrganisationsService,
  KudosTokenFactoryService,
  KudosPollFactoryService,

  KudosTokenService,
];
