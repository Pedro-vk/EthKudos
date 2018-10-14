import { moesifGetMetadata, moesifSkipEvent, moesifGetEnv } from './moesif.helpers';

describe('Moesif helpers', () => {
  it('should skip the event that returned ok', () => {
    const event = {
      response: {
        status: 200,
      },
    };

    expect(moesifSkipEvent(event)).toBeTruthy();
  });

  it('should not skip the event that returned an error', () => {
    const event = {
      response: {
        status: 500,
      },
    };

    expect(moesifSkipEvent(event)).toBeFalsy();
  });

  it('should skip some web3 calls that are in the skip list if returned ok', () => {
    const getEventByCall =  method => ({
      metadata: {_web3: true},
      response: {
        status: 200,
      },
      request: {
        body: {
          method,
        },
      },
    });

    expect(moesifSkipEvent(getEventByCall('eth_accounts'))).toBeTruthy();
    expect(moesifSkipEvent(getEventByCall('eth_blockNumber'))).toBeTruthy();
    expect(moesifSkipEvent(getEventByCall('net_version'))).toBeTruthy();
    expect(moesifSkipEvent(getEventByCall('eth_getBlockByNumber'))).toBeTruthy();
    expect(moesifSkipEvent(getEventByCall('eth_getBalance'))).toBeTruthy();
    expect(moesifSkipEvent(getEventByCall('eth_call'))).toBeTruthy();
    expect(moesifSkipEvent(getEventByCall('eth_getCode'))).toBeTruthy();
    expect(moesifSkipEvent(getEventByCall('eth_gasPrice'))).toBeTruthy();
    expect(moesifSkipEvent(getEventByCall('eth_getTransactionReceipt'))).toBeTruthy();
    expect(moesifSkipEvent(getEventByCall('eth_getTransactionByHash'))).toBeTruthy();
    expect(moesifSkipEvent(getEventByCall('eth_subscribe'))).toBeTruthy();
  });

  it('should not skip some web3 calls that are in the skip list if returned an error', () => {
    const getEventByCall =  method => ({
      metadata: {_web3: true},
      response: {
        status: 500,
      },
      request: {
        body: {
          method,
        },
      },
    });

    expect(moesifSkipEvent(getEventByCall('eth_accounts'))).toBeFalsy();
    expect(moesifSkipEvent(getEventByCall('eth_blockNumber'))).toBeFalsy();
    expect(moesifSkipEvent(getEventByCall('net_version'))).toBeFalsy();
    expect(moesifSkipEvent(getEventByCall('eth_getBlockByNumber'))).toBeFalsy();
    expect(moesifSkipEvent(getEventByCall('eth_getBalance'))).toBeFalsy();
    expect(moesifSkipEvent(getEventByCall('eth_call'))).toBeFalsy();
    expect(moesifSkipEvent(getEventByCall('eth_getCode'))).toBeFalsy();
    expect(moesifSkipEvent(getEventByCall('eth_gasPrice'))).toBeFalsy();
    expect(moesifSkipEvent(getEventByCall('eth_getTransactionReceipt'))).toBeFalsy();
    expect(moesifSkipEvent(getEventByCall('eth_getTransactionByHash'))).toBeFalsy();
    expect(moesifSkipEvent(getEventByCall('eth_subscribe'))).toBeFalsy();
  });

  it('should know the enviroment', () => {
    expect(moesifGetEnv('eth-kudos.com')).toBe('prod');
    expect(moesifGetEnv('pre.eth-kudos.com')).toBe('pre');
    expect(moesifGetEnv('ethkudos-xhashx.now.sh')).toBe('snapshot');
    expect(moesifGetEnv('localhost')).toBe('dev');
    expect(moesifGetEnv('127.0.0.1')).toBe('dev');
    expect(moesifGetEnv('acme.org')).toBe('unknown');
  });

  it('should return the metadata of an event', () => {
    const event = {
      response: {
        status: 200,
      },
    };

    expect(moesifGetMetadata(event, {network: 'main'})).toEqual({
      network: 'main',
      isWeb3: false,
      env: 'dev',
    });
  });
});
