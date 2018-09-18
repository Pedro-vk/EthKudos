export interface KudosPollGratitude {
  kudos: number;
  message: string;
  from: string;
}
export type KudosPollGratitudes = {[member: string]: KudosPollGratitude[]};

export interface KudosPollGeneratedData {
  allGratitudes: {to: string, from: string, kudos: number, message: string}[];
  kudos: {[member: string]: number};
  results: {
    member: string,
    kudos: number,
    gratitudesReceived: number,
    gratitudesSent: number,
    achievements: {
      topSender: boolean,
      onTop: boolean,
      noParticipation: boolean,
    };
  }[]
}

export interface KudosPollData extends KudosPollGeneratedData {
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
