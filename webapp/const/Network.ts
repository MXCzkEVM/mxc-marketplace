
import { ethers } from 'ethers'

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAINID || "5167003"

const networks: any = {
  "5167004": {
    chainId: 5167004,
    rpc: ["https://geneva-rpc.moonchain.com"],
    // rpc: ["http://207.246.99.8:8545"],
    nativeCurrency: {
      decimals: 18,
      name: "MXC Token",
      symbol: "MXC",
    },
    shortName: "geneva",
    slug: "geneva",
    testnet: true,
    chain: "Geneva",
    name: "MoonChain Testnet",
    icon: {
      url: "https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg",
      height: 512,
      width: 512,
      format: 'png'
    },
    etherscan: "http://geneva-explorer.moonchain.com",
    graphNode: "https://geneva-graph-node.moonchain.com"
  },
  "18686": {
    chainId: 18686,
    rpc: ["https://rpc.mxc.com"],
    nativeCurrency: {
      decimals: 18,
      name: "MXC Token",
      symbol: "MXC",
    },
    shortName: "MoonChain Mainnet",
    slug: "MoonChain Mainnet",
    testnet: false,
    chain: "Mainnet",
    name: "MoonChain Mainnet",
    icon: {
      url: "https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg",
      height: 512,
      width: 512,
      format: 'png'
    },
    etherscan: "http://explorer.mxc.com",
    graphNode: "https://mxc-graph.mxc.com"
  },
  "1337": {
    chainId: 1337,
    rpc: ["http://127.0.0.1:7545"],
    nativeCurrency: {
      decimals: 18,
      name: "MXC Token",
      symbol: "MXC",
    },
    shortName: "wannsee",
    slug: "wannsee",
    testnet: true,
    chain: "Wannsee",
    name: "Wannsee zkEVM Testnet",
    icon: {
      url: "https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg",
      height: 512,
      width: 512,
      format: 'png'
    },
    etherscan: "",
    graphNode: "https://geneva-graph-node.moonchain.com"
  },
  "31337": {
    chainId: 31337,
    rpc: ["http://127.0.0.1:8545"],
    nativeCurrency: {
      decimals: 18,
      name: "MXC Token",
      symbol: "MXC",
    },
    shortName: "wannsee",
    slug: "wannsee",
    testnet: true,
    chain: "Wannsee",
    name: "Wannsee zkEVM Testnet",
    icon: {
      url: "https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg",
      height: 512,
      width: 512,
      format: 'png'
    },
    etherscan: "",
    graphNode: "https://geneva-graph-node.moonchain.com"
  },
}


export const NETWORK = networks[CHAIN_ID]
export const ETHERSCAN_URL = NETWORK.etherscan
export const provider = new ethers.providers.JsonRpcProvider(networks[CHAIN_ID].rpc[0], {
  chainId: +CHAIN_ID,
  name: 'MXC'
});
export const graphNode = NETWORK.graphNode

export const gatewayUrls = {
  "ipfs://": [
    "https://gateway.pinata.cloud/ipfs/",
    "https://ipfs.thirdwebstorage.com/ipfs/",
    "https://gateway.ipfscdn.io/ipfs/",
    "https://ipfs.w3s.link",
    "https://cloudflare-ipfs.com/ipfs/",
    // "https://aqua-adverse-coyote-886.mypinata.cloud/ipfs/",
  ],
}




