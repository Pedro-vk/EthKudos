import { createSelector } from '@ngrx/store';

import * as kudosPollActions from './kudos-poll.actions';
import { KudosPollData, KudosPollGratitudes, KudosPollGeneratedData } from './kudos-poll.models';

export function generateResultsFromState(state: Partial<KudosPollData> = {}): KudosPollGeneratedData {
  const allGratitudes = Object.entries(state.gratitudes || {})
    .map(([to, gratitudes]) =>
      gratitudes.map(({from, kudos, message}) => ({to, kudos: kudos / 10 ** (state.decimals || 0), message, from})),
    )
    .reduce((acc, _) => [...acc, ..._], []);
  const initial = (state.members || []).reduce((acc, _) => ({...acc, [_]: 0}), {});
  const gratitudesByMember = allGratitudes
    .reduce(({received, sent}, {from, to}) => ({
      received: {...received, [to.toLowerCase()]: (received[to.toLowerCase()] || 0) + 1},
      sent: {...sent, [from.toLowerCase()]: (sent[from.toLowerCase()] || 0) + 1},
    }), {received: {...initial}, sent: {...initial}});
  const kudosByMember = allGratitudes
    .reduce((acc, {to, kudos}) => ({...acc, [to]: (acc[to] || 0) + kudos}), {...initial});
  const maxGratitudesSent = Math.max(...Object.values<number>(gratitudesByMember.sent));
  return {
    allGratitudes,
    kudos: kudosByMember,
    results: Object.entries(kudosByMember)
      .map(([member, kudos]: [string, number]) => ({
        member,
        kudos,
        gratitudesReceived: gratitudesByMember.received[member],
        gratitudesSent: gratitudesByMember.sent[member],
        achievements: {
          topSender: gratitudesByMember.sent[member] === maxGratitudesSent,
          onTop: (gratitudesByMember.sent[member] >= (maxGratitudesSent * 0.8)),
          noParticipation: gratitudesByMember.sent[member] === 0,
        },
      })),
  };
}

export interface KudosPollState {
  kudosPolls: {
    [address: string]: KudosPollData & {
      loading: boolean;
      loaded: {
        basic: boolean;
        dynamic: boolean;
      };
    };
  };
}

const initialState: KudosPollState = {
  kudosPolls: {},
};

export function kudosPollReducer(state: KudosPollState = initialState, action: kudosPollActions.Actions): KudosPollState {
  switch (action.type) {
    case kudosPollActions.LOAD_BASIC_DATA:
    case kudosPollActions.LOAD_DYNAMIC_DATA:
    case kudosPollActions.LOAD_ACCOUNT_GRATITUDES: {
      const {address} = action.payload;
      return {
        ...state,
        kudosPolls: {
          ...state.kudosPolls,
          [address]: {
            ...(state.kudosPolls[address] || {} as any),
            loading: true,
            loaded: {
              ...((state.kudosPolls[address] || {} as any).loaded || {}),
            },
          },
        },
      };
    }

    case kudosPollActions.SET_DATA: {
      const {address, type, data} = action.payload;
      return {
        ...state,
        kudosPolls: {
          ...state.kudosPolls,
          [address]: {
            ...(state.kudosPolls[address] || {} as any),
            loading: false,
            loaded: {
              ...((state.kudosPolls[address] || {} as any).loaded || {}),
              ...(type ? {[type]: true} : {}),
            },
            ...data,
            ...generateResultsFromState(data),
          },
        },
      };
    }

    case kudosPollActions.SET_BALANCE: {
      const {address, account, balance} = action.payload;
      return {
        ...state,
        kudosPolls: {
          ...state.kudosPolls,
          [address]: {
            ...(state.kudosPolls[address] || {} as any),
            loading: false,
            balances: {
              ...(state.kudosPolls[address] || {} as any).balances,
              [account]: balance,
            },
          },
        },
      };
    }

    case kudosPollActions.SET_GRATITUDES: {
      const {address, account, gratitudes} = action.payload;
      const kudosPoll = {
        ...(state.kudosPolls[address] || {} as any),
        loading: false,
        gratitudes: {
          ...(state.kudosPolls[address] || {} as any).gratitudes,
          [account]: gratitudes,
        },
      };
      return {
        ...state,
        kudosPolls: {
          ...state.kudosPolls,
          [address]: {
            ...kudosPoll,
            ...generateResultsFromState(kudosPoll),
          },
        },
      };
    }

    default: return state;
  }
}

/* tslint:disable:max-line-length */
export const getKudosPollsById = (state: KudosPollState) => state.kudosPolls;
export const getKudosPolls = (state: KudosPollState) => Object.values(state.kudosPolls);

// By id
export const getKudosPollByAddress = (address: string) => createSelector(getKudosPollsById, state => state[address]);
export const getKudosPollLoading = (address: string) => createSelector(getKudosPollByAddress(address), state => (state || {} as any).loading);
export const getKudosPollLoaded = (address: string) => createSelector(getKudosPollByAddress(address), state => (state || {} as any).loaded);

