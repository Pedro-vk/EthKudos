import { TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { hot, cold } from 'jasmine-marbles';

import { PROVIDERS } from '../../';
import { State, reducers } from '../';

import { reduceActions } from '../testing-utils';

import { accountReducer } from './account.reducers';
import * as fromAccount from './account.reducers';
import * as accountActions from './account.actions';
import { AccountEffects } from './account.effects';

const newAccount = n => `0x${'0'.repeat(40 - String(n).length)}${n}`;
const newTx = n => `0x${'0'.repeat(65 - String(n).length)}${n}`;

describe('Account - Reducers', () => {
  it('should be auto-initialized', () => {
    const finalState = reduceActions(accountReducer);
    expect(finalState).not.toBeUndefined();
  });

  it('should set the account', () => {
    const steps = reduceActions(accountReducer, [
      new accountActions.SetAccountAction(newAccount(1)),
      new accountActions.SetAccountAction(newAccount(2)),
      new accountActions.SetAccountAction(newAccount(3)),
    ], true);

    const account = steps.map(fromAccount.getAccount);

    expect(account).toEqual([
      undefined,
      newAccount(1),
      newAccount(2),
      newAccount(3),
    ]);
  });

  it('should set the balance', () => {
    const steps = reduceActions(accountReducer, [
      new accountActions.SetBalanceAction(1111),
      new accountActions.SetBalanceAction(2222),
      new accountActions.SetBalanceAction(3333),
    ], true);

    const balance = steps.map(fromAccount.getBalance);

    expect(balance).toEqual([
      0,
      1111,
      2222,
      3333,
    ]);
  });

  it('should add new transactions', () => {
    const steps = reduceActions(accountReducer, [
      new accountActions.AddNewTransactionAction(newTx(1)),
      new accountActions.AddNewTransactionAction(newTx(2)),
      new accountActions.AddNewTransactionAction(newTx(3)),
    ], true);

    const transactions = steps.map(fromAccount.getPendingTransactionsById);

    expect(transactions).toEqual([
      {},
      {[newTx(1)]: {}},
      {[newTx(1)]: {}, [newTx(2)]: {}},
      {[newTx(1)]: {}, [newTx(2)]: {}, [newTx(3)]: {}},
    ]);
  });

  it('should remove transactions', () => {
    const steps = reduceActions(accountReducer, [
      new accountActions.AddNewTransactionAction(newTx(1)),
      new accountActions.AddNewTransactionAction(newTx(2)),
      new accountActions.RemoveTransactionAction(newTx(1)),
    ], true);

    const transactions = steps.map(fromAccount.getPendingTransactionsById);

    expect(transactions).toEqual([
      {},
      {[newTx(1)]: {}},
      {[newTx(1)]: {}, [newTx(2)]: {}},
      {[newTx(2)]: {}},
    ]);
  });

  it('should add transactions metadata', () => {
    const steps = reduceActions(accountReducer, [
      new accountActions.AddNewTransactionAction(newTx(1)),
      new accountActions.SetTransactionMetadataAction(newTx(1), <any>{method: 'test'}),
    ], true);

    const transactions = steps.map(fromAccount.getPendingTransactionsById);

    expect(transactions).toEqual([
      {},
      {[newTx(1)]: {}},
      {[newTx(1)]: {method: 'test'}},
    ]);
  });

  it('should set confirmations to transactions', () => {
    const steps = reduceActions(accountReducer, [
      new accountActions.AddNewTransactionAction(newTx(1)),
      new accountActions.SetTransactionConfirmationsAction(newTx(1), 10),
    ], true);

    const transactions = steps.map(fromAccount.getPendingTransactionsById);

    expect(transactions).toEqual([
      {},
      {[newTx(1)]: {}},
      {[newTx(1)]: {confirmations: 10}},
    ]);
  });
});

describe('Account - Effects', () => {
  let store: Store<State>;
  let effects: AccountEffects;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          ...reducers,
        }),
      ],
      providers: [
        ...PROVIDERS,
        AccountEffects,
        provideMockActions(() => actions),
      ],
    });

    effects = TestBed.get(AccountEffects);
    store = TestBed.get(Store);
  });

  it('should watch for account changes', () => {
    const fakeAddress = cold('--a--b--c', {
      a: newAccount(1),
      b: newAccount(2),
      c: newAccount(3),
    });

    spyOn(effects, 'getWeb3Account').and.returnValue(fakeAddress);

    actions = hot('-a', {
      a: {type: ROOT_EFFECTS_INIT},
    });

    const expected = cold('---a--b--c', {
      a: new accountActions.SetAccountAction(newAccount(1)),
      b: new accountActions.SetAccountAction(newAccount(2)),
      c: new accountActions.SetAccountAction(newAccount(3)),
    });

    expect(effects.watchAccountChanges$).toBeObservable(expected);
  });

  it('should watch for balance changes', () => {
    const fakeAddress = cold('--a--b--c', {
      a: 1111,
      b: 2222,
      c: 3333,
    });

    spyOn(effects, 'getWeb3Balance').and.returnValue(fakeAddress);

    actions = hot('-a', {
      a: {type: ROOT_EFFECTS_INIT},
    });

    const expected = cold('---a--b--c', {
      a: new accountActions.SetBalanceAction(1111),
      b: new accountActions.SetBalanceAction(2222),
      c: new accountActions.SetBalanceAction(3333),
    });

    expect(effects.watchBalanceChanges$).toBeObservable(expected);
  });

  it('should get the metadata of a transaction', () => {
    spyOn((<any>effects).web3Service, 'getTransaction').and.callFake(hash => Observable.of({hash}));
    spyOn((<any>effects).web3Service, 'getTransactionMetadata').and.callFake(transaction => ({...transaction, method: 'test'}));

    actions = hot('-a-b', {
      a: new accountActions.AddNewTransactionAction(newTx(1)),
      b: new accountActions.AddNewTransactionAction(newTx(2)),
    });

    const expected = cold('-a-b', {
      a: new accountActions.SetTransactionMetadataAction(newTx(1), <any>{method: 'test', hash: newTx(1)}),
      b: new accountActions.SetTransactionMetadataAction(newTx(2), <any>{method: 'test', hash: newTx(2)}),
    });

    expect(effects.getMetadataOfNewTransactions$).toBeObservable(expected);
  });

  it('should remove a transaction when have 24 confirmations', () => {
    actions = hot('-a-b-f', {
      a: new accountActions.SetTransactionConfirmationsAction(newTx(1), 10),
      b: new accountActions.SetTransactionConfirmationsAction(newTx(1), 20),
      f: new accountActions.SetTransactionConfirmationsAction(newTx(1), 24),
    });

    const expected = cold('-----r', {
      r: new accountActions.RemoveTransactionAction(newTx(1)),
    });

    expect(effects.removeTransactionOnConfirmations$).toBeObservable(expected);
  });

  it('should get the pending transactions from web3', () => {
    const checkInterval = hot('-i-i-i-i---i-i-i-i-i-i-i-i---i-i', {
      i: undefined,
    });
    (<any>effects).web3Service._web3 = true;
    spyOn(effects, 'getCheckInterval').and.returnValue(checkInterval);

    const transactionsRaw = {
      [newTx(1)]: {from: newAccount(1), hash: newTx(1)},
      [newTx(2)]: {from: newAccount(1), hash: newTx(2)},
      [newTx(3)]: {from: newAccount(1), hash: newTx(3)},
      [newTx(4)]: {from: newAccount(1), hash: newTx(4)},
      [newTx(5)]: {from: newAccount(1), hash: newTx(5)},
    };
    let transactions = {};
    const transactionsList = Object.values(transactionsRaw);
    let blockNumber = 0;
    spyOn((<any>effects).web3Service, 'getTransaction').and.callFake(tx => Observable.of(transactions[tx]));
    spyOn((<any>effects).web3Service, 'getBlock').and.callFake(() => {
      let block;
      const setTransactions = txsList => transactions = txsList.reduce((acc, _) => ({...acc, [_.hash]: _}), {});
      const setBlock = (txsList, size) => block = {size, transactions: txsList};
      const setTxs = (txsList, size) => {
        setTransactions(txsList);
        setBlock(txsList, size);
      };
      if (blockNumber <= 2) {
        setTxs(transactionsList.slice(0, 4), 4);
      } else if (blockNumber <= 4) {
        setTxs(transactionsList.slice(0, 4), 41);
      } else if (blockNumber <= 12) {
        setTxs(transactionsList.slice(0, 2), 2);
      } else if (blockNumber <= 15) {
        setTxs([...transactionsList.slice(1, 2), transactionsList[4]], 11);
      } else {
        setTxs([], 0);
      }
      blockNumber++;
      return Observable.of(block);
    });

    actions = hot('-a', {
      a: new accountActions.SetAccountAction(newAccount(1)),
    });

    const expected = cold('---(abcd)--(xy)----------(ev)--(wz)', {
      a: new accountActions.AddNewTransactionAction(newTx(1)),
      b: new accountActions.AddNewTransactionAction(newTx(2)),
      c: new accountActions.AddNewTransactionAction(newTx(3)),
      d: new accountActions.AddNewTransactionAction(newTx(4)),
      e: new accountActions.AddNewTransactionAction(newTx(5)),
      v: new accountActions.RemoveTransactionAction(newTx(1)),
      w: new accountActions.RemoveTransactionAction(newTx(2)),
      x: new accountActions.RemoveTransactionAction(newTx(3)),
      y: new accountActions.RemoveTransactionAction(newTx(4)),
      z: new accountActions.RemoveTransactionAction(newTx(5)),
    });

    expect(effects.getPreviousPendingTransactions$).toBeObservable(expected);
  });
});
