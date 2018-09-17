export interface KudosPollGratitude {
  kudos: number;
  message: string;
  from: string;
}
export type KudosPollGratitudes = {[member: string]: KudosPollGratitude[]};

export interface KudosPollData {
  // Basic information
  address: string;
  version: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  kudosByMember: number;
  maxKudosToMember: number;
  minDeadline: number;
  creation: number;

  // Dynamic information
  active: boolean;
  members: string[];
  balances: {[member: string]: number};
  gratitudes: KudosPollGratitudes;
}
