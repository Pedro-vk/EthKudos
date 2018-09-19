"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./animations/card-in-out"));
__export(require("./guards/is-connected.guard"));
__export(require("./guards/is-owner.guard"));
__export(require("./guards/is-poll.guard"));
__export(require("./guards/is-token.guard"));
__export(require("./contracts/kudos-organisations.service"));
__export(require("./contracts/kudos-poll.service"));
__export(require("./contracts/kudos-token.service"));
__export(require("./kudos-poll-factory.service"));
__export(require("./kudos-token-factory.service"));
__export(require("./service-worker.service"));
__export(require("./translation-loader.service"));
__export(require("./web3.service"));
var is_connected_guard_1 = require("./guards/is-connected.guard");
var is_owner_guard_1 = require("./guards/is-owner.guard");
var is_poll_guard_1 = require("./guards/is-poll.guard");
var is_token_guard_1 = require("./guards/is-token.guard");
var kudos_organisations_service_1 = require("./contracts/kudos-organisations.service");
var kudos_poll_factory_service_1 = require("./kudos-poll-factory.service");
var kudos_token_factory_service_1 = require("./kudos-token-factory.service");
var service_worker_service_1 = require("./service-worker.service");
var translation_loader_service_1 = require("./translation-loader.service");
var web3_service_1 = require("./web3.service");
exports.PROVIDERS = [
    is_connected_guard_1.IsConnectedGuard,
    is_owner_guard_1.IsOwnerGuard,
    is_poll_guard_1.IsPollGuard,
    is_token_guard_1.IsTokenGuard,
    kudos_organisations_service_1.KudosOrganisationsService,
    kudos_poll_factory_service_1.KudosPollFactoryService,
    kudos_token_factory_service_1.KudosTokenFactoryService,
    service_worker_service_1.ServiceWorkerService,
    translation_loader_service_1.TranslationLoaderService,
    web3_service_1.Web3Service,
];
//# sourceMappingURL=index.js.map