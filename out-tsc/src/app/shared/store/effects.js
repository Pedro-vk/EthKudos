"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var account_1 = require("./account");
var kudos_poll_1 = require("./kudos-poll");
var kudos_token_1 = require("./kudos-token");
var router_1 = require("./router");
var status_1 = require("./status");
exports.effects = [
    account_1.AccountEffects,
    kudos_poll_1.KudosPollEffects,
    kudos_token_1.KudosTokenEffects,
    router_1.RouterEffects,
    status_1.StatusEffects,
];
//# sourceMappingURL=effects.js.map