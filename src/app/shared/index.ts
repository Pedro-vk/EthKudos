export * from './animations/card-in-out';

export * from './guards/is-connected.guard';
export * from './guards/is-owner.guard';
export * from './guards/is-poll.guard';
export * from './guards/is-token.guard';

export * from './contracts/kudos-organisations.service';
export * from './contracts/kudos-poll.service';
export * from './contracts/kudos-token.service';

export * from './kudos-poll-factory.service';
export * from './kudos-token-factory.service';
export * from './service-worker.service';
export * from './translation-loader.service';
export * from './web3.service';

import { IsConnectedGuard } from './guards/is-connected.guard';
import { IsOwnerGuard } from './guards/is-owner.guard';
import { IsPollGuard } from './guards/is-poll.guard';
import { IsTokenGuard } from './guards/is-token.guard';
import { KudosOrganisationsService } from './contracts/kudos-organisations.service';
import { KudosPollFactoryService } from './kudos-poll-factory.service';
import { KudosTokenFactoryService } from './kudos-token-factory.service';
import { ServiceWorkerService } from './service-worker.service';
import { TranslationLoaderService } from './translation-loader.service';
import { Web3Service } from './web3.service';

export const PROVIDERS = [
  IsConnectedGuard,
  IsOwnerGuard,
  IsPollGuard,
  IsTokenGuard,
  KudosOrganisationsService,
  KudosPollFactoryService,
  KudosTokenFactoryService,
  ServiceWorkerService,
  TranslationLoaderService,
  Web3Service,
];
