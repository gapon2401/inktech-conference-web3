import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import "./tasks/contract";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.18",
        settings: {
            metadata: {
                // Not including the metadata hash
                // https://github.com/paulrberg/solidity-template/issues/31
                bytecodeHash: "none",
            },
            optimizer: {
                enabled: true,
                runs: 200,
            }
        }
    },
    networks: {
        goerli: {
            url: process.env.GOERLI_URL,
            accounts:
                process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
        mainnet: {
            url: process.env.MAINNET_URL,
            accounts:
                process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        },
    },
    gasReporter: {
        currency: "USD",
        enabled: !!process.env.REPORT_GAS,
        excludeContracts: [],
        src: "./contracts",
    },
    paths: {
        artifacts: "./artifacts",
        cache: "./cache",
        sources: "./contracts",
        tests: "./test",
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    mocha: {
        timeout: 100000000
    },
};

export default config;
