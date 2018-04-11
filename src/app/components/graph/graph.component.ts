import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
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

  nodes: (cytoscape.NodeDefinition | any)[] = [
    {data: {id: 'a', v:  1, h:  0, name: 'Ifan Colon', address: 'RANDOM #####Ifan Colon#####'}},
    {data: {id: 'b', v:  0, h:  1, name: 'Phoenix Mclean', address: 'RANDOM #####Phoenix Mclean##### 1'}},
    {data: {id: 'c', v:  0, h:  1, name: 'Carlie Lim', address: 'RANDOM #####Carlie Lim##### 1'}},
    {data: {id: 'd', v: -1, h:  0, name: 'Luci Haynes', address: 'RANDOM #####Luci Haynes##### @892'}},
    {data: {id: 'e', v: -1, h:  0, name: 'Jaya Lovell', address: 'RANDOM #####Jaya Lovell#####'}},
    {data: {id: 'f', v:  0, h: -1, name: 'Larry Pineda', address: 'RANDOM #####Larry Pineda#####'}},
    {data: {id: 'g', v:  0, h: -1, name: 'Robbie Shepherd', address: 'RANDOM #####Robbie Shepherd##### 2'}},
  ];
  edgesList = [
    ['b', 'a', 1, 'Thanks for setting up my PC'], ['c', 'a', 0.5, 'I love the new laptops!'],
    ['f', 'g', 0.2, 'Thanks for watering my cactus :)'], ['c', 'd', 1, 'You are an amazing coworker'],
    ['e', 'a', 2, 'The server is working again! Thanks!'], ['f', 'a', 1.5, 'Thanks for requeue the data!'],
    ['g', 'a', 0.2, 'Thanks for install the printer'], ['a', 'b', 0.5, 'I love the new plants!'],
    ['g', 'c', 0.8, 'I love the new branding'], ['f', 'c', 1.2, 'Thanks to sending me the new branding'],
    ['c', 'b', 1, 'Thanks for buying the bamboo tables'], ['d', 'c', 1, 'I appreciate your dedication'],
    ['d', 'e', 0.5, 'Thanks for you help'], ['e', 'f', 0.1, 'Thanks for the coffee ;)'],
  ];
  style: cytoscape.Stylesheet[] = (<any>cytoscape).stylesheet()
    .selector('node')
      .css({
        'height': 32,
        'width': 32,
        'background-image': (element) =>
          `url(${blockies({seed: (element.data().address || '#').toLowerCase(), size: 8, scale: 8}).toDataURL()})`,
        'background-fit': 'cover',
        'text-valign': (element) => ['bottom', 'center', 'top'][element.data().v + 1],
        'text-halign': (element) => ['left', 'center', 'right'][element.data().h + 1],
        'text-margin-y': (element) => element.data().v * -10,
        'text-margin-x': (element) => element.data().h * 10,
      })
    .selector('edge')
      .css({
        'label': '•',
        'color': '#7EA4D0',
        'font-size': 40,
        'font-family': 'arial',
        'text-margin-y': 3,
        'text-outline-color': '#fafafa', // Main background color
        'text-outline-width': 4,
        'curve-style': 'bezier',
        'width': 3,
        'target-arrow-shape': 'triangle',
        'line-color': '#b3ccea',
        'target-arrow-color': '#b3ccea',
        'source-distance-from-node': 6,
        'target-distance-from-node': 6,
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

  edgeHover$ = new Subject<{x: number, rX: number, y: number, data: any, sourceMember: any, targetMember: any}>();
  edgeHoverBuffer$ = this.edgeHover$.filter(_ => !!_);
  nodeHover$ = new Subject<{x: number, rX: number, y: number, data: any}>();
  nodeHoverBuffer$ = this.nodeHover$.filter(_ => !!_);
  private cy: cytoscape.Core;

  constructor() { }

  ngOnInit() {
    this.initCytoscape();
    this.initInterval();
    this.initEdgeMouseEvents();

    this.graph.nativeElement.onmouseout = () => {
      this.edgeHover$.next(undefined);
      this.nodeHover$.next(undefined);
    };

    this.mqSmall = matchMedia('(max-width: 460px)');
    this.mqSmall.addListener(() => this.cyResize());
    this.cyResize();
  }

  cyResize() {
    this.cy.resize();
    this.cy.fit();
    Array.from(new Array(10))
      .map((_, i) => i * 100)
      .forEach(time => setTimeout(() => {
        this.cy.resize();
        this.cy.fit();
      }, time));
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
      layout: {
        name: 'circle',
        directed: true,
        padding: 0,
        avoidOverlap: true,
      },
      autoungrabify: true,
      autounselectify: true,
      userPanningEnabled: false,
      boxSelectionEnabled: false,
      userZoomingEnabled: false,
    });
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

  initEdgeMouseEvents() {
    const getPosition = p => p / this.cy.container().clientWidth * 100;
    const getPercentageX = (x: number) => Math.round(x / this.cy.container().clientWidth * 10);

    const getMember = id => this.nodes.find(_ => _.data.id === id).data;
    this.cy.on('mouseover', 'edge', event => {
      const position = event.target.renderedBoundingBox();
      const data = event.target.data();
      this.edgeHover$.next({
        x: getPosition(position.x2 - position.w / 2),
        rX: getPercentageX(position.x2 - position.w / 2),
        y: getPosition(position.y2 - position.h / 2),
        data,
        sourceMember: getMember(data.source),
        targetMember: getMember(data.target),
      });
      // event.target.addClass('hover');
    });

    const getKudos = id => this.edgesList
      .filter(_ => _[1] === id)
      .map(_ => _[2])
      .reduce((acc, _) => +acc + +_, 0);
    this.cy.on('mouseover', 'node', event => {
      const position = event.target.renderedBoundingBox();
      const data = event.target.data();
      this.nodeHover$.next({
        x: getPosition(position.x2 - position.w / 2),
        rX: getPercentageX(position.x2 - position.w / 2),
        y: getPosition(position.y2 - position.h / 2),
        data: {
          ...data,
          kudos: getKudos(data.id),
        },
      });
    });

    this.cy.on('mouseout', 'edge', event => {
      this.edgeHover$.next(undefined);
      // event.target.removeClass('hover');
    });
    this.cy.on('mouseout', 'node', () => this.nodeHover$.next(undefined));
  }
}
