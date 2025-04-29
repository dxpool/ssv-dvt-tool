import { Config } from "./types.config";

export default <Config>{
  network: {
    mainnet: {
      nodeUrl: "",
      network: "mainnet",
      ownerAddress: "",
    },
    hoodi: {
      nodeUrl: "",
      network: "hoodi",
      ownerAddress: "",
    },
  },
  externalLink: "https://stake.dxpool.com/ethereum/staking?step=1",
  // This is our api to get the operator list, if you want to use ssv official api, you may need to change specific code in buildUrl function
  baseUrl: "https://ssv.stake.dxpool.in/api/v1/validators/eth-ssv-operator"
};