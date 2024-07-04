import { Config } from './types.config';

// 1. create a config.ts file in the same category 
// 2. copy the code below 
// 3. fill the blanks (nodeUrl, ownerAddress, defaultOperator(optional), externalLink, baseUrl)

export default <Config> {
  network:{
    holesky: {
      nodeUrl: "",
      network: "holesky",
      ownerAddress: "",
      defaultOperator: [
        {
          name: "",
          id: 1,
          fee: "",
          validators_count: 1,
          mev_relays: "",
          logo: "",
          public_key: ""
        }
      ]
    },
    mainnet: {
      nodeUrl: "",
      network: "mainnet",
      ownerAddress: "",
      defaultOperator: [
        {
          name: "",
          id: 1,
          fee: "",
          validators_count: 1,
          mev_relays: "",
          logo: "",
          public_key: ""
        }
      ]
    },
  },
  externalLink: "https://stake.dxpool.com/ethereum/staking?step=1",
  // This is our api to get the operator list, if you want to use ssv official api, you may need to change specific code in buildUrl function
  baseUrl: "https://ssv.stake.dxpool.in/api/v1/validators/eth-ssv-operator"
}