"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Subject_1 = require("rxjs/Subject");
require("rxjs/add/operator/filter");
var blockies = require("blockies");
var cytoscape = require("cytoscape");
function hexToArray(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.toLowerCase());
    return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}
var GraphComponent = /** @class */ (function () {
    function GraphComponent() {
        var _this = this;
        this.randomly = true;
        this.cleanRandom = (function () { });
        this.edgeHover$ = new Subject_1.Subject();
        this.edgeHoverBuffer$ = this.edgeHover$.filter(function (_) { return !!_; });
        this.nodeHover$ = new Subject_1.Subject();
        this.nodeHoverBuffer$ = this.nodeHover$.filter(function (_) { return !!_; });
        this.coseLayout = {
            name: 'cose',
            idealEdgeLength: 100,
            nodeOverlap: 20,
            refresh: 20,
            fit: true,
            padding: 30,
            randomize: false,
            componentSpacing: 100,
            nodeRepulsion: 3000000,
            edgeElasticity: 100,
            nestingFactor: 5,
            gravity: 80,
            numIter: 1000,
            initialTemp: 200,
            coolingFactor: 0.95,
            minTemp: 1.0
        };
        this.circleLayout = {
            name: 'circle',
            directed: true,
            fit: this.large,
            avoidOverlap: true,
        };
        this.getPosition = function (axis, p) { return p / _this.cy.container()[axis === 'x' ? 'clientWidth' : 'clientHeight'] * 100; };
        this.getPercentageX = function (x) { return Math.round(x / _this.cy.container().clientWidth * 10); };
        this.getPercentageY = function (y) { return Math.round(y / _this.cy.container().clientHeight * 10); };
        this.getMember = function (id) { return _this.nodes.find(function (_) { return _.data.id === id; }).data; };
        this.getKudos = function (id) { return _this.edgesList
            .filter(function (_) { return _[1] === id; })
            .map(function (_) { return _[2]; })
            .reduce(function (acc, _) { return +acc + +_; }, 0); };
    }
    GraphComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.edgesList || !this.nodes) {
            return;
        }
        this.setStyle();
        this.initCytoscape();
        this.initEdgeMouseEvents();
        if (!this.large) {
            this.initInterval();
            var initRandomTimeout_1 = setTimeout(function () { return _this.initRandom(); }, 1000);
            this.cleanRandom = function () { return clearTimeout(initRandomTimeout_1); };
        }
        this.graph.nativeElement.onmouseout = function () {
            _this.edgeHover$.next(undefined);
            _this.nodeHover$.next(undefined);
        };
        this.mqSmall = matchMedia('(max-width: 460px)');
        this.mqSmall.addListener(function () { return _this.cyResize(); });
        this.cyResize();
    };
    GraphComponent.prototype.cyResize = function (skipDelay) {
        var _this = this;
        var padding = this.large ? 40 : 0;
        this.cy.resize();
        this.cy.fit(undefined, padding);
        if (!skipDelay) {
            Array.from(new Array(10))
                .map(function (_, i) { return i * 100; })
                .forEach(function (time) { return setTimeout(function () {
                _this.cy.resize();
                _this.cy.fit(undefined, padding);
            }, time); });
        }
    };
    GraphComponent.prototype.initCytoscape = function () {
        this.cy = cytoscape({
            container: this.graph.nativeElement,
            elements: {
                nodes: this.nodes
                    .map(function (node) { return (__assign({}, node, { selectable: false })); }),
                edges: this.edgesList
                    .map(function (_a) {
                    var source = _a[0], target = _a[1], kudos = _a[2], message = _a[3];
                    return ({
                        selectable: false,
                        data: { source: source, target: target, kudos: kudos, message: message },
                    });
                }),
            },
            style: this.style,
            layout: this.circleLayout,
            autoungrabify: !this.large,
            autounselectify: true,
            userPanningEnabled: false,
            boxSelectionEnabled: false,
            userZoomingEnabled: false,
            maxZoom: 1,
        });
        this.cy
            .nodes()
            .filter(function (node) { return node.connectedEdges(':visible').size() === 0; })
            .style('display', 'none');
    };
    GraphComponent.prototype.initInterval = function () {
        var _this = this;
        var n = 0;
        var update = function () {
            var edges = _this.cy.edges();
            edges
                .forEach(function (edge, i) {
                var highlight = (((edges.length + n - i) % edges.length) / edges.length) >= 0.7;
                if (highlight && !edge.hasClass('highlight')) {
                    edge.addClass('highlight');
                }
                if (!highlight && edge.hasClass('highlight')) {
                    edge.removeClass('highlight');
                }
            });
            n++;
        };
        update();
        setInterval(function () { return update(); }, 500);
    };
    GraphComponent.prototype.setLayout = function (layout) {
        this.cy
            .layout(layout === 'circle' ? this.circleLayout : this.coseLayout)
            .run();
        this.cyResize(true);
    };
    GraphComponent.prototype.initRandom = function () {
        var _this = this;
        var edges = this.cy.edges();
        var edge;
        do {
            edge = edges[Math.floor(edges.length * Math.random())];
        } while (this.activeRandom === edge);
        this.showEdgeTooltip(edge.renderedBoundingBox(), edge.data());
        var t1 = setTimeout(function () { return _this.edgeHover$.next(undefined); }, 4000);
        var t2 = setTimeout(function () { return _this.initRandom(); }, 4500);
        this.cleanRandom = function () {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    };
    GraphComponent.prototype.initEdgeMouseEvents = function () {
        var _this = this;
        this.cy.on('mouseover', 'edge', function (event) {
            var position = event.target.renderedBoundingBox();
            var data = event.target.data();
            _this.showEdgeTooltip(position, data);
            _this.cleanRandom();
            if (_this.large) {
                event.target.addClass('hover');
            }
        });
        this.cy.on('mouseover', 'node', function (event) {
            var position = event.target.renderedBoundingBox();
            var data = event.target.data();
            _this.showNodeTooltip(position, data);
            _this.cleanRandom();
        });
        this.cy.on('mouseout mousedown touchstart', 'edge', function (event) {
            _this.edgeHover$.next(undefined);
            if (_this.large) {
                event.target.removeClass('hover');
            }
        });
        this.cy.on('mouseout mousedown touchstart', 'node', function () { return _this.nodeHover$.next(undefined); });
    };
    GraphComponent.prototype.showEdgeTooltip = function (position, data) {
        this.edgeHover$.next({
            x: this.getPosition('x', position.x2 - position.w / 2),
            rX: this.getPercentageX(position.x2 - position.w / 2),
            y: this.getPosition('y', position.y2 - position.h / 2),
            rY: this.getPercentageY(position.y2 - position.h / 2),
            data: data,
            sourceMember: this.getMember(data.source),
            targetMember: this.getMember(data.target),
        });
    };
    GraphComponent.prototype.showNodeTooltip = function (position, data) {
        this.nodeHover$.next({
            x: this.getPosition('x', position.x2 - position.w / 2),
            rX: this.getPercentageX(position.x2 - position.w / 2),
            y: this.getPosition('y', position.y2 - position.h / 2),
            rY: this.getPercentageY(position.y2 - position.h / 2),
            data: __assign({}, data, { kudos: this.getKudos(data.id) }),
        });
    };
    GraphComponent.prototype.setStyle = function () {
        this.style = cytoscape.stylesheet()
            .selector('node')
            .css({
            'height': 32,
            'width': 32,
            'background-image': function (element) {
                return "url(" + blockies({ seed: (element.data().address || '#').toLowerCase(), size: 8, scale: 8 }).toDataURL() + ")";
            },
            'background-fit': 'cover',
        })
            .selector('edge')
            .css({
            'label': this.large ? '' : '•',
            'color': '#7EA4D0',
            'font-size': 40,
            'font-family': 'arial',
            'text-margin-y': 3,
            'text-outline-color': '#fafafa',
            'text-outline-width': 4,
            'curve-style': 'bezier',
            'width': this.large ? 2 : 3,
            'target-arrow-shape': 'triangle',
            'line-color': '#b3ccea',
            'target-arrow-color': '#b3ccea',
            'source-distance-from-node': this.large ? 12 : 6,
            'target-distance-from-node': this.large ? 12 : 6,
            'transition-property': 'color, line-color, target-arrow-color',
            'transition-timing-function': 'ease',
            'transition-duration': '.4s',
            'z-index': 1,
        })
            .selector('.highlight')
            .css({
            'color': '#D5A302',
            'line-color': '#FFD23A',
            'target-arrow-color': '#FFD23A',
            'z-index': 2,
        })
            .selector('.hover')
            .css({
            'color': '#7B6752',
            'line-color': '#a58768',
            'target-arrow-color': '#a58768',
            'z-index': 3,
        });
    };
    __decorate([
        core_1.ViewChild('graph'),
        __metadata("design:type", core_1.ElementRef)
    ], GraphComponent.prototype, "graph", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], GraphComponent.prototype, "large", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], GraphComponent.prototype, "nodes", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], GraphComponent.prototype, "edgesList", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], GraphComponent.prototype, "symbol", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], GraphComponent.prototype, "decimals", void 0);
    GraphComponent = __decorate([
        core_1.Component({
            selector: 'eth-kudos-graph',
            templateUrl: './graph.component.html',
            styleUrls: ['./graph.component.scss']
        }),
        __metadata("design:paramtypes", [])
    ], GraphComponent);
    return GraphComponent;
}());
exports.GraphComponent = GraphComponent;
//# sourceMappingURL=graph.component.js.map