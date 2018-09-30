import { InjectionToken } from '@angular/core';

export const MOESIF_INSTANCE_TOKEN = new InjectionToken('MOESIF_INSTANCE');

const web3skipList = [
  'eth_accounts', 'eth_blockNumber', 'net_version', 'eth_getBlockByNumber', 'eth_getBalance', 'eth_call',
  'eth_getCode', 'eth_gasPrice', 'eth_getTransactionReceipt', 'eth_getTransactionByHash', 'eth_subscribe',
];

function getEventData(event: any) {
  const isWeb3 = !!(event.metadata || {} as any)._web3;
  const {verb, uri, body} = event.request || {} as any;
  const {status} = event.response || {} as any;
  const {method} = body || {} as any;
  const isOk = status === 200 || status === 201;

  return {isWeb3, verb, uri, body, status, method, isOk};
}

export function moesifSkipEvent(event: any = {}): boolean {
  const {isWeb3, isOk, method} = getEventData(event);
  if (!isWeb3 && isOk) {
    return true;
  }
  if (isWeb3 && web3skipList.indexOf(method) !== -1 && isOk) {
    return true;
  }
  return false;
}

export function moesifGetEnv(url?: string): 'prod' | 'pre' | 'dev' | 'unknown' {
  switch (url || (window && window.location && window.location.hostname)) {
    case 'eth-kudos.com': return 'prod';
    case 'pre.eth-kudos.com': return 'pre';
    case 'localhost':
    case '127.0.0.1':
      return 'dev';
    default: return 'unknown';
  }
}

const env = moesifGetEnv();

export function moesifGetMetadata(event: any = {}, web3env: any): any {
  const {isWeb3} = getEventData(event);
  return {...web3env, env, isWeb3};
}
