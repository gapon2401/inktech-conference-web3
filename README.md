# Demo smartcontract for room renting

This project shows the basics of creation and deployment of smartcontracts via [hardhat](https://hardhat.org/)

## Before deployment

1. Clone the repo and run `yarn install`.
2. Specify variables in `.env` file.
- `PRIVATE_KEY` - the private key of the wallet, that will be the owner of the contract
- `GOERLI_URL` and `MAINNET_URL` - use [https://infura.io/](https://infura.io/) or [https://www.alchemy.com/](https://www.alchemy.com/) for getting the urls.
- `ETHERSCAN_API_KEY` - etherscan key. Register on [https://etherscan.io](https://etherscan.io) and on the page [https://etherscan.io/myapikey](https://etherscan.io/myapikey) create and copy your key
- `REPORT_GAS` - are we going to use gas reporter or not.

Do not upload `.env` file with sensitive data to your repo, add it to `.gitignore`.

## How to test?

Run `npx hardhat test`

There are 9 basic tests

## How to deploy and verify the contract?

- Deployment to Goerli network
```
npx hardhat deploy:Contract --network goerli
``` 
- Deployment to Mainnet
```
npx hardhat deploy:Contract --network mainnet
``` 

After the deployment you will see the contract address in terminal:

Wait about 5 - 15 minutes and try to verify it. If you get an error while verifying, don't worry, just try to wait more time.

In general verify function looks like this:

```
npx hardhat verify --network <YOUR_NETWORK> <DEPLOYED_CONTRACT_ADDRESS> <arg1> <arg2> <argn>
```

`<YOUR_NETWORK>` can be taken from `hardhat.config.ts`. Now it can be `goerli` or `mainnet`.

For Goerli network it can look like this:

```
npx hardhat verify --network goerli 0x6c00Ad33aD42DA40fad268003bf46Fe3c82bdf38
```

## Available tasks

- Deploy the contract

```
npx hardhat deploy:Contract --network <YOUR_NETWORK>
```


## Useful links

- [Create, deploy and mint smart contract (ERC-721) with NodeJS + Hardhat + Walletconnect + Web3modal](https://dev.to/igaponov/create-deploy-and-mint-smart-contract-erc-721-with-nodejs-hardhat-walletconnect-web3modal-59o8)
- [How to Implement a Whitelist in Smart Contracts (ERC-721 NFT, ERC-1155, and others)](https://www.freecodecamp.org/news/how-to-implement-whitelist-in-smartcontracts-erc-721-nft-erc-1155-and-others/)