import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-waffle";
import "hardhat-docgen"

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    anvil: {
      url: "http://localhost:8545",
    },
    wannsee: {
            url: "https://wannsee-rpc.mxc.com",
            chainId: 5167003,
            //accounts: ["6ae4bf9ec354bb7770407fef831151d5857d731a8bb98ce0b1d215861337e8e4"],
            accounts: ["6ae4bf9ec354bb7770407fef831151d5857d731a8bb98ce0b1d215861337e8e4"] as HttpNetworkAccountsUserConfig | undefined,
            //gasPrice: 9000000000000,
            saveDeployments: true,
        }
  }
};

export default config;
