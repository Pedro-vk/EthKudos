export * from './web3.service';
export * from './kudos-token.service';

import { Web3Service } from './web3.service';
import { KudosTokenService } from './kudos-token.service';

export const PROVIDERS = [
  Web3Service,
  KudosTokenService,
];
