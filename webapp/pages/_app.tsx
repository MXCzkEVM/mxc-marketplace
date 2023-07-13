import type { AppProps } from "next/app"
import { ThirdwebProvider } from "@thirdweb-dev/react"
import { Navbar } from "../components/Navbar/Navbar"
import NextNProgress from "nextjs-progressbar"
import { NETWORK } from "@/const/Network"
import { storageInterface } from "@/util/thirdwebStorage"

import { StateContextProvider } from "../context"
import Head from "next/head"
import { ToastContainer } from "react-toastify"

import "../styles/globals.css"
import "../styles/index.css"
import "../styles/pages/index.scss"
import "../styles/collection/style.scss"
import "react-toastify/dist/ReactToastify.css"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={NETWORK}
      supportedChains={[NETWORK]}
      // storageInterface={storageInterface}
    >
      <ToastContainer />
      <Head>
        <title>MXC NFT Marketplaces</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="MXC zkEVM uses LPWAN and NFC technology to track authenticate, and submit location proofs for the real world collectables."
        />
        <meta
          name="keywords"
          content="MXC, zkEVM, NFT, LPWAN, NFC, technology, track, authenticate, location proofs, real world, collectables"
        ></meta>
        {/* This script will check all MXC operations and if the system experiences any downtime It will notify with a small notification*/}
        <script
          src="https://mxc.instatus.com/en/13076080/widget/script.js"
          async
        ></script>
      </Head>
      {/* Progress bar when navigating between pages */}
      <NextNProgress
        color="var(--color-tertiary)"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />

      {/* Render the navigation menu above each component */}
      <Navbar />
      {/* Render the actual component (page) */}
      <StateContextProvider>
        <Component {...pageProps} />
      </StateContextProvider>
    </ThirdwebProvider>
  )
}

export default MyApp
