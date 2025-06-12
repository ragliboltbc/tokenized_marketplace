# ⛓️🏠 Tokenized Marketplace


🏛️ A decentralized platform for tokenizing real-world assets (RWAs) and enabling lending-based co-ownership. Built on Hedera with Scaffold-ETH 2, this marketplace lets you mint NFTs for physical assets, lend HBAR to earn fractional ownership, and manage your digital portfolio with full transparency and compliance. See [project outcome @ETHGlobal](https://ethglobal.com/showcase/tknzd-market-p-axsvn)

<img src="https://github.com/user-attachments/assets/c18d2d63-c0bb-4574-925a-207a64989ecc" alt="Marketplace logic" width="600">


⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, Typescript, and deployed on **Hedera Testnet**.

## 🌟 Core Features

### Asset Tokenization
- **🪙 NFT Minting**: Convert real-world assets (cars, real estate, luxury items, art) into ERC-721 NFTs
- **📋 Rich Metadata**: Store detailed asset information including category, description, legal ID, brand, and estimated value
- **🖼️ Visual Assets**: Support for asset images and visual representation

### Lending & Co-ownership System
- **💰 HBAR Lending**: Lend HBAR against tokenized assets to earn interest
- **🎯 Fractional Ownership**: Receive LendingTokens (ERC-20) representing your share of financed assets
- **🔒 Asset Locking**: Secure lending mechanism with asset locking during active loans
- **📊 Interest Management**: Configurable interest rates and loan durations

### Marketplace
- **🏪 Asset Listings**: List NFTs for sale with configurable pricing
- **💼 Offer System**: Create and manage lending offers with custom terms
- **🤝 Crowdfunded Purchases**: Pool lender contributions to collectively purchase assets
- **⚡ Instant Trading**: Direct asset transfers and payment processing

### Portfolio Management
- **📈 Dashboard**: Track owned assets, active loans, and lending positions
- **💎 Asset Overview**: Comprehensive view of your tokenized assets
- **💸 Lending Portfolio**: Monitor your lending investments and returns
- **🔄 Loan Management**: Repay loans and manage debt obligations

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.


## 🏗 Smart Contracts

The platform consists of four main smart contracts deployed on Hedera Testnet:

### AssetNFT.sol
- **Purpose**: ERC-721 contract for tokenizing real-world assets
- **Features**: 
  - Mint NFTs representing physical assets
  - Store comprehensive metadata (name, category, description, legal ID, brand, estimated value)
  - Owner-controlled minting with proper access controls

### LendingToken.sol  
- **Purpose**: ERC-20 token representing fractional ownership in financed assets
- **Features**:
  - Mint tokens to lenders when they finance assets
  - Burn tokens when loans are repaid
  - Only authorized minters can create/destroy tokens

### AssetLendingLink.sol
- **Purpose**: Core lending logic linking assets to lending tokens
- **Features**:
  - Enable HBAR lending against specific NFT assets
  - Asset locking during active loans
  - Loan repayment and lender withdrawal mechanisms
  - Track lending balances and repayment amounts

### Marketplace.sol
- **Purpose**: Trading and offer management platform
- **Features**:
  - List assets for sale with custom pricing
  - Create lending offers with interest rates and durations
  - Crowdfunded asset purchases through pooled lender contributions
  - Automatic asset transfer upon full funding

## 🎯 Application Features

### Frontend Pages

#### `/mint` - Asset Tokenization
- Mint new NFTs for real-world assets
- Input detailed metadata including category, description, and estimated value
- Upload asset images for visual representation

#### `/marketplace` - Asset Discovery & Trading
- Browse all tokenized assets with filtering capabilities
- Create purchase offers and lending proposals
- View asset details including owner, price, and metadata
- Direct buy functionality for listed assets

#### `/lenders` - Lender Dashboard
- View all available lending opportunities
- Contribute to existing offers to collectively finance assets
- Track total investment and active offers
- Monitor lending portfolio performance

#### `/portfolio` - Asset Management
- Overview of owned NFT assets
- Track financed assets and lending positions
- Manage loan repayments and debt obligations
- List assets for sale on the marketplace

#### `/lend` - Direct Lending Interface
- Browse assets available for lending
- Create lending offers with custom terms
- Monitor financed assets and expected returns
- Track lending history and performance

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with the Tokenized Marketplace, follow these steps:

1. Clone this repository and install dependencies:

```bash
git clone <repository-url>
cd tokenized_marketplace
yarn install
```

2. Run a local Hardhat network in the first terminal:

```bash
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `packages/hardhat/hardhat.config.ts`.

3. On a second terminal, deploy the smart contracts:

```bash
yarn deploy
```

This command deploys the four main smart contracts (`AssetNFT`, `LendingToken`, `AssetLendingLink`, and `Marketplace`) to the local network. The contracts are located in `packages/hardhat/contracts` and the deploy script is in `packages/hardhat/deploy`.

4. On a third terminal, start your NextJS app:

```bash
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contracts using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract tests with `yarn hardhat:test`

## Project Structure

- **Smart Contracts**: Edit your smart contracts in `packages/hardhat/contracts`
- **Frontend**: Edit your frontend pages in `packages/nextjs/app`
  - `/mint` - Asset tokenization interface
  - `/marketplace` - Asset trading and offers
  - `/lenders` - Lender dashboard for portfolio management
  - `/portfolio` - Personal asset and loan management
  - `/lend` - Direct lending interface
- **Deployment Scripts**: Edit deployment scripts in `packages/hardhat/deploy`
- **Tests**: Smart contract tests in `packages/hardhat/test`

For guidance on [routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes) and configuring [pages/layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts), check out the Next.js documentation.


## Documentation of Template

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Scaffold-ETH 2 Documentation</a> |
  <a href="https://scaffoldeth.io">Scaffold-ETH 2 Website</a>
</h4>

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)


To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
