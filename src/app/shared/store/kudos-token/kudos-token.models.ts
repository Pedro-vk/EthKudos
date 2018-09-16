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
  balances: {[member: string]: number};

  // Total
  owner: string;
  contacts: {[member: string]: string};
  polls: string[];
  isActivePoll: boolean;
}
