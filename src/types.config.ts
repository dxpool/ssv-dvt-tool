// types.config.ts
export interface Operator {
  name: string;
  id: number;
  fee: string;
  mev_relays: string;
  dkg_address: string;
  address_whitelist: string;
  performance: any;
  logo: string;
  is_active: number;
  status: string;
  public_key: string;
  validators_count: number;
  type: string;
}

export interface NetworkConfig {
  nodeUrl: string;
  network: string;
  ownerAddress: string;
  defaultOperator: Operator[];
}

export interface NetworkTypeConfig {
  holesky: NetworkConfig;
  mainnet: NetworkConfig;
  hoodi: NetworkConfig;
}

export interface Config {
  network: NetworkTypeConfig;
  externalLink: string;
  baseUrl: string; 
}