export * from './web3.service';
export * from './kudos-token.service';
export * from './kudos-poll.service';
export * from './kudos-poll-factory.service';

import { Web3Service } from './web3.service';
import { KudosTokenService } from './kudos-token.service';
import { KudosPollFactoryService } from './kudos-poll-factory.service';

export const PROVIDERS = [
  Web3Service,
  KudosTokenService,
  KudosPollFactoryService,
];