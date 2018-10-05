import { Component, Input, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import * as blockies from 'blockies';
import * as cytoscape from 'cytoscape';

function hexToArray(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.toLowerCase());
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

@Component({
  selector: 'eth-kudos-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  @ViewChild('graph') graph: ElementRef;
  mqSmall: MediaQueryList;
  randomly = true;
  activeRandom: any;
  cleanRandom: Function = <any>(() => {});

  @Input() large;
  @Input() nodes: (cytoscape.NodeDefinition | any)[];
  @Input() edgesList;
  @Input() symbol;
  @Input() decimals;

  style: cytoscape.Stylesheet[];

  edgeHover$ = new Subject<{x: number, rX: number, y: number, rY: number, data: any, sourceMember: any, targetMember: any}>();
  edgeHoverBuffer$ = this.edgeHover$.filter(_ => !!_);
  nodeHover$ = new Subject<{x: number, rX: number, y: number, rY: number, data: any}>();
  nodeHoverBuffer$ = this.nodeHover$.filter(_ => !!_);
  private cy: cytoscape.Core;

  private readonly coseLayout = {
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
  private readonly circleLayout = {
    name: 'circle',
    directed: true,
    fit: this.large,
    avoidOverlap: true,
  };

  constructor() { }

  ngOnInit() {
    if (!this.edgesList || !this.nodes) {
      return;
    }
    this.setStyle();
    this.initCytoscape();
    this.initEdgeMouseEvents();

    if (!this.large) {
      this.initInterval();
      const initRandomTimeout = setTimeout(() => this.initRandom(), 1000);
      this.cleanRandom = () => clearTimeout(initRandomTimeout);
    }

    this.graph.nativeElement.onmouseout = () => {
      this.edgeHover$.next(undefined);
      this.nodeHover$.next(undefined);
    };

    this.mqSmall = matchMedia('(max-width: 460px)');
    this.mqSmall.addListener(() => this.cyResize());
    this.cyResize();
  }

  cyResize(skipDelay?: boolean) {
    const padding = this.large ? 40 : 0;
    this.cy.resize();
    this.cy.fit(undefined, padding);
    if (!skipDelay) {
      Array.from(new Array(10))
        .map((_, i) => i * 100)
        .forEach(time => setTimeout(() => {
          this.cy.resize();
          this.cy.fit(undefined, padding);
        }, time));
    }
  }

  initCytoscape() {
    this.cy = cytoscape({
      container: this.graph.nativeElement,
      elements: {
        nodes: this.nodes
          .map(node => ({
            ...node,
            selectable: false,
          })),
        edges: this.edgesList
          .map(([source, target, kudos, message]: any[]) => ({
            selectable: false,
            data: {source, target, kudos, message},
          })),
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
      .filter((node: any) => node.connectedEdges(':visible').size() === 0)
      .style('display', 'none');
  }

  initInterval() {
    let n = 0;

    const update = () => {
      const edges = this.cy.edges();
      edges
        .forEach((edge, i) => {
          const highlight = (((edges.length + n - i) % edges.length) / edges.length) >= 0.7;
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
    setInterval(() => update(), 500);
  }

  setLayout(layout: string) {
    this.cy
      .layout(layout === 'circle' ? this.circleLayout : this.coseLayout)
      .run();
    this.cyResize(true);
  }

  readonly getPosition = (axis, p) => p / this.cy.container()[axis === 'x' ? 'clientWidth' : 'clientHeight'] * 100;
  readonly getPercentageX = (x: number) => Math.round(x / this.cy.container().clientWidth * 10);
  readonly getPercentageY = (y: number) => Math.round(y / this.cy.container().clientHeight * 10);
  readonly getMember = id => this.nodes.find(_ => _.data.id === id).data;
  readonly getKudos = id => this.edgesList
    .filter(_ => _[1] === id)
    .map(_ => _[2])
    .reduce((acc, _) => +acc + +_, 0)

  initRandom() {
    const edges = this.cy.edges();
    let edge;
    do {
      edge = edges[Math.floor(edges.length * Math.random())];
    } while (this.activeRandom === edge);

    this.showEdgeTooltip(edge.renderedBoundingBox(), edge.data());

    const t1 = setTimeout(() => this.edgeHover$.next(undefined), 4000);
    const t2 = setTimeout(() => this.initRandom(), 4500);

    this.cleanRandom = () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }

  initEdgeMouseEvents() {
    this.cy.on('mouseover', 'edge', event => {
      const position = event.target.renderedBoundingBox();
      const data = event.target.data();
      this.showEdgeTooltip(position, data);
      this.cleanRandom();
      if (this.large) {
        event.target.addClass('hover');
      }
    });

    this.cy.on('mouseover', 'node', event => {
      const position = event.target.renderedBoundingBox();
      const data = event.target.data();
      this.showNodeTooltip(position, data);
      this.cleanRandom();

      const sel = event.target;
      this.cy.elements().subtract(sel).subtract(sel.outgoers()).subtract(sel.incomers()).addClass('no-focus');
      sel.outgoers().addClass('focus-out');
      sel.incomers().addClass('focus-in');
    });

    this.cy.on('mouseout mousedown touchstart', 'edge', event => {
      this.edgeHover$.next(undefined);
      if (this.large) {
        event.target.removeClass('hover');
      }
    });
    this.cy.on('mouseout mousedown touchstart', 'node', () => {
      this.nodeHover$.next(undefined);
      this.cy.elements()
        .removeClass('no-focus')
        .removeClass('focus-out')
        .removeClass('focus-in');
    });
  }

  showEdgeTooltip(position, data) {
    this.edgeHover$.next({
      x: this.getPosition('x', position.x2 - position.w / 2),
      rX: this.getPercentageX(position.x2 - position.w / 2),
      y: this.getPosition('y', position.y2 - position.h / 2),
      rY: this.getPercentageY(position.y2 - position.h / 2),
      data,
      sourceMember: this.getMember(data.source),
      targetMember: this.getMember(data.target),
    });
  }

  showNodeTooltip(position, data) {
    this.nodeHover$.next({
      x: this.getPosition('x', position.x2 - position.w / 2),
      rX: this.getPercentageX(position.x2 - position.w / 2),
      y: this.getPosition('y', position.y2 - position.h / 2),
      rY: this.getPercentageY(position.y2 - position.h / 2),
      data: {
        ...data,
        kudos: this.getKudos(data.id),
      },
    });
  }

  setStyle() {
    this.style = (<any>cytoscape).stylesheet()
      .selector('node')
        .css({
          'height': 32,
          'width': 32,
          'background-image': (element) =>
            `url(${blockies({seed: (element.data().address || '#').toLowerCase(), size: 8, scale: 8}).toDataURL()})`,
          'background-fit': 'cover',
          'transition-property': 'opacity',
          'transition-timing-function': 'ease',
          'transition-duration': '.2s',
        })
      .selector('edge')
        .css({
          'label': this.large ? '' : '•',
          'color': '#7EA4D0',
          'font-size': 40,
          'font-family': 'arial',
          'text-margin-y': 3,
          'text-outline-color': '#fafafa', // Main background color
          'text-outline-width': 4,
          'curve-style': 'bezier',
          'width': this.large ? 2 : 3,
          'target-arrow-shape': 'triangle',
          'line-color': '#b3ccea',
          'target-arrow-color': '#b3ccea',
          'source-distance-from-node': this.large ? 12 : 6,
          'target-distance-from-node': this.large ? 12 : 6,
          'transition-property': 'color, line-color, target-arrow-color, opacity',
          'transition-timing-function': 'ease',
          'transition-duration': '.4s',
          'opacity': 1,
          'z-index': 1,
        })
      .selector('.highlight')
        .css({
          'color': '#D5A302',
          'line-color': '#FFD23A',
          'target-arrow-color': '#FFD23A',
          'z-index': 2,
        })
      .selector('.no-focus')
        .css({
          'opacity': .3,
        })
      .selector('.focus-in')
        .css({
          'color': '#55B9B0',
          'line-color': '#009688',
          'target-arrow-color': '#009688',
          'z-index': 3,
        })
      .selector('.focus-out')
        .css({
          'color': '#FFBA55',
          'line-color': '#FF9800',
          'target-arrow-color': '#FF9800',
          'z-index': 3,
        })
      .selector('.hover')
        .css({
          'color': '#7B6752',
          'line-color': '#a58768',
          'target-arrow-color': '#a58768',
          'z-index': 3,
        });
  }
}
