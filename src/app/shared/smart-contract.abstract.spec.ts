import { TestBed, inject } from '@angular/core/testing';
import * as Web3Module from 'web3';

import { Web3Service } from './web3.service';

import { SmartContract } from './smart-contract.abstract';

class SmartContractExtended extends SmartContract<any, any, any, any> { }

describe('SmartContract', () => {
  const newBN = n => new (new (<any>Web3Module)()).utils.BN(n);
  let smartContract: SmartContractExtended & any;
  let web3Service: Web3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Web3Service],
    });
  });

  beforeEach(inject([Web3Service], (service: Web3Service) => {
    web3Service = service;
    smartContract = new SmartContractExtended(service);
  }));

  it('should be created', () => {
    expect(smartContract).toBeTruthy();
  });

  it('should generate a constant getter that returns undefined if have not contract', done => {
    smartContract.testConstant = () => smartContract.generateConstant('testConstant')();

    (<Promise<string>>smartContract.testConstant())
      .then(_ => {
        expect(_).toBeUndefined();
        done();
      });
  });

  it('should generate a constant getter that returns values', done => {
    const testValueConstantSpy = jasmine.createSpy('testValueConstant');
    const testBigNumberConstantSpy = jasmine.createSpy('testBigNumberConstant');
    const testArrayConstantSpy = jasmine.createSpy('testArrayConstant');
    const testArgsConstantSpy = jasmine.createSpy('testArgsConstant');

    smartContract.contract = {
      testValueConstant: testValueConstantSpy.and.returnValue(new Promise(resolve => resolve('testValue'))),
      testBigNumberConstant: testBigNumberConstantSpy.and.returnValue(new Promise(resolve => resolve(newBN(100)))),
      testArrayConstant: testArrayConstantSpy.and.returnValue(new Promise(resolve => resolve(['abc', newBN(100)]))),
      testArgsConstant: testArgsConstantSpy.and.callFake(_ => new Promise(resolve => resolve(_))),
    };
    smartContract.testValueConstant = () => smartContract.generateConstant('testValueConstant')();
    smartContract.testBigNumberConstant = () => smartContract.generateConstant('testBigNumberConstant')();
    smartContract.testArrayConstant = () => smartContract.generateConstant('testArrayConstant', ([a, b]) => [a, +b])();
    smartContract.testArgsConstant = _ => smartContract.generateConstant('testArgsConstant')(_);

    (<Promise<string>>smartContract.testValueConstant())
      .then(_ => {
        expect(_).toEqual('testValue');
        expect(testValueConstantSpy).toHaveBeenCalled();
      });
    (<Promise<number>>smartContract.testBigNumberConstant())
      .then(_ => {
        expect(_).toEqual(100);
        expect(testBigNumberConstantSpy).toHaveBeenCalled();
      });
    (<Promise<any[]>>smartContract.testArrayConstant())
      .then(_ => {
        expect(_).toEqual(['abc', 100]);
        expect(testArrayConstantSpy).toHaveBeenCalled();
      });
    (<Promise<string>>smartContract.testArgsConstant('args'))
      .then(_ => {
        expect(_).toEqual('args');
        expect(testArgsConstantSpy).toHaveBeenCalled();
      });

    setTimeout(() => done(), 1000);
  });

  it('should generate a constant iterator getter', done => {
    const testCountSpy = jasmine.createSpy('testCount').and.returnValue(new Promise(resolve => resolve(2)));
    const testValueConstantSpy = jasmine.createSpy('testValueConstant').and.callFake(n => new Promise(resolve => resolve(n * 10)));

    (<Promise<any>>smartContract.generateConstantIteration(
      testCountSpy,
      testValueConstantSpy,
    ))
      .then(_ => {
        expect(_).toEqual([0, 10]);
        expect(testCountSpy).toHaveBeenCalled();
        expect(testValueConstantSpy).toHaveBeenCalledTimes(2);
        done();
      });
  });
});
