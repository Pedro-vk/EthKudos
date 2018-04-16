export * from './animations/card-in-out';
export * from './is-connected.guard';
export * from './is-owner.guard';
export * from './is-poll.guard';
export * from './is-token.guard';
export * from './kudos-organisations.service';
export * from './kudos-poll-factory.service';
export * from './kudos-poll.service';
export * from './kudos-token-factory.service';
export * from './kudos-token.service';
export * from './service-worker.service';
export * from './translation-loader.service';
export * from './web3.service';

import { IsConnectedGuard } from './is-connected.guard';
import { IsOwnerGuard } from './is-owner.guard';
import { IsPollGuard } from './is-poll.guard';
import { IsTokenGuard } from './is-token.guard';
import { KudosOrganisationsService } from './kudos-organisations.service';
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
