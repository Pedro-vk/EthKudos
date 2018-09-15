export interface KudosTokenData {
  // Basic information
  address: string;
  version: string;
  organisationName: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  members: string[];

  // Total
  contacts: {member: string, name: string}[];
  polls: string[];
  isActivePoll: boolean;
  balances: {member: string, balance: number, name: string}[];
}
