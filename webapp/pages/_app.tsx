import type { AppProps } from "next/app"
import { Navbar } from "@/components/Navbar"
import NextNProgress from "nextjs-progressbar"
import { NETWORK } from "@/const/Network"
import { storageInterface } from "@/util/thirdwebStorage"
import React, { useState } from "react"
import NoSSR from "@/components/NoSSR"
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  WalletOptions,
  walletConnect,
} from "@thirdweb-dev/react"
import { WalletConfig } from "@thirdweb-dev/react-core"
import { InjectedWallet } from "@thirdweb-dev/wallets"
import { SessionProvider } from "next-auth/react"

import { EnsProvider, StateContextProvider } from "../context"
import Head from "next/head"
import { ToastContainer } from "react-toastify"
import LanguageModal from "@/components/Language"
import { useTranslation } from "react-i18next"
import "@/util/i18n"

import "../styles/globals.css"
import "../styles/index.css"
import "../styles/pages/index.scss"
import "../styles/collection/style.scss"
import "react-toastify/dist/ReactToastify.css"
import "@moonchain/metadata/style.css"

function axsWallet(): WalletConfig<InjectedWallet> {
  return {
    id: "axs",
    meta: {
      name: "AXS Wallet",
      iconURL: "/axs.svg",
    },
    create: (options: WalletOptions) => {
      return new InjectedWallet(options)
    },
  }
}

function okxWallet(): WalletConfig<InjectedWallet> {
  return {
    id: "okx",
    meta: {
      name: "OKX Wallet",
      iconURL: "/okx.webp",
    },
    create: (options: WalletOptions) => {
      return new InjectedWallet(options)
    },
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const [showModal, setShowLangModal] = useState(false)
  const { i18n } = useTranslation()

  return (
    <SessionProvider session={pageProps.session}>
      <EnsProvider>
        <ThirdwebProvider
          supportedWallets={[
            axsWallet(),
            {...metamaskWallet(), isInstalled: undefined},
            okxWallet(),
            walletConnect(),
            coinbaseWallet(),
          ]}
          activeChain={NETWORK}
          supportedChains={[NETWORK]}
          storageInterface={storageInterface}
        >
          <ToastContainer />
          <Head>
            <title>MoonChain NFT Marketplaces</title>
            <link rel="shortcut icon" type="image/png" href="https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta
              name="description"
              content="MoonChain uses LPWAN and NFC technology to track, authenticate, and submit location proofs for the real world collectables."
            />
            <meta
              name="keywords"
              content="MoonChain, NFT, LPWAN, NFC, technology, track, authenticate, location proofs, real world, collectables"
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
          <NoSSR>
            <Navbar setLangVisible={setShowLangModal} />
          </NoSSR>
          {/* Render the actual component (page) */}
          <StateContextProvider>
            <NoSSR>
              <Component {...pageProps} />
            </NoSSR>
          </StateContextProvider>
          {showModal && (
            <LanguageModal
              currentLanguage={(i18n as any).language}
              setLangVisible={setShowLangModal}
            />
          )}
        </ThirdwebProvider>
      </EnsProvider>
    </SessionProvider>

  )
}

export default MyApp
