/** Replace the values below with the addresses of your smart contracts. */

// 1. Set up the network your smart contracts are deployed to.
// First, import the chain from the package, then set the NETWORK variable to the chain.
// import { Mumbai } from "@thirdweb-dev/chains";
// export const NETWORK = Mumbai;

// // 2. The address of the marketplace V3 smart contract.
// // Deploy your own: https://thirdweb.com/thirdweb.eth/MarketplaceV3
// export const MARKETPLACE_ADDRESS = "0x6604bd9D7770035f26B4ACeab2C746fdCE166473";

// // 3. The address of your NFT collection smart contract.
// export const NFT_COLLECTION_ADDRESS =
//   "0xFfd9bAddF3f6e427EfAa1A4AEC99131078C1d683";

// // (Optional) Set up the URL of where users can view transactions on
// // For example, below, we use Mumbai.polygonscan to view transactions on the Mumbai testnet.
// export const ETHERSCAN_URL = "https://mumbai.polygonscan.com";


// import { Mumbai } from "@thirdweb-dev/chains";
// export const NETWORK = Mumbai;
// export const MARKETPLACE_ADDRESS = "0x6604bd9D7770035f26B4ACeab2C746fdCE166473";
// export const NFT_COLLECTION_ADDRESS =
//   "0xFfd9bAddF3f6e427EfAa1A4AEC99131078C1d683";
// export const ETHERSCAN_URL = "https://mumbai.polygonscan.com";

// import { ArbitrumGoerli } from "@thirdweb-dev/chains";
// export const NETWORK = ArbitrumGoerli;
// export const MARKETPLACE_ADDRESS = "0xCEEee8ABC5AfD3c0589d10646E0F332208D64892";
// export const NFT_COLLECTION_ADDRESS =
//   "0x5cD0cDDeb65EF8875Cd18Ad7872Ba7Cb446411bB";
// export const ETHERSCAN_URL = "https://mumbai.polygonscan.com";


// import { Sepolia } from "@thirdweb-dev/chains";
// export const NETWORK = Sepolia;
// export const MARKETPLACE_ADDRESS = "0xF3192406a619c6d1bf94bE822eaE9f2CaA7B991a";
// export const NFT_COLLECTION_ADDRESS =
//   "0xeD8E000f947Ff9614739761A1CBe2B8b01d74364";
// export const ETHERSCAN_URL = "https://mumbai.polygonscan.com";


export const NETWORK = {
  // === Required information for connecting to the network === \\
  chainId: 5167003, // Chain ID of the network
  // Array of RPC URLs to use
  rpc: ["https://wannsee-rpc.mxc.com"],

  // === Information for adding the network to your wallet (how it will appear for first time users) === \\
  // Information about the chains native currency (i.e. the currency that is used to pay for gas)
  nativeCurrency: {
    decimals: 18,
    name: "MXC Token",
    symbol: "MXC",
  },
  shortName: "wannsee", // Display value shown in the wallet UI
  slug: "wannsee", // Display value shown in the wallet UI
  testnet: true, // Boolean indicating whether the chain is a testnet or mainnet
  chain: "Wannsee", // Name of the network
  name: "Wannsee zkEVM Testnet", // Name of the network
  icon: {
    url: "https://wannsee-bridge.mxc.com/assets/mxc.d04bb8f6.png",
    height: 512,
    width: 512,
    format: 'png'
  }
}
// console.log(NETWRK)
export const MARKETPLACE_ADDRESS = "0x81bF860d83D525d3C1A41596821137ea8c66463d";
export const NFT_COLLECTION_ADDRESS =
  "0x5B4722aAC3E896e1cE15B3Eccce412775E359CEa";
export const ETHERSCAN_URL = "http://wannsee-explorer.mxc.com";