"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var service_worker_service_1 = require("./service-worker.service");
describe('ServiceWorkerService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [service_worker_service_1.ServiceWorkerService]
        });
    });
    it('should be created', testing_1.inject([service_worker_service_1.ServiceWorkerService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=service-worker.service.spec.js.map