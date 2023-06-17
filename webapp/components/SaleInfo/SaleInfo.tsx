import { NFT as NFTType } from "@thirdweb-dev/sdk"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

import styles from "../../styles/Sale.module.css"
import profileStyles from "../../styles/Profile.module.css"
import {
  useContract,
  useCreateAuctionListing,
  useCreateDirectListing,
  Web3Button,
} from "@thirdweb-dev/react"
import { NATIVE_TOKEN_ADDRESS, TransactionResult } from "@thirdweb-dev/sdk"
import {
  MARKETPLACE_ADDRESS,
  NFT_COLLECTION_ADDRESS,
} from "../../const/contractAddresses"
import { useRouter } from "next/router"
import toast, { Toaster } from "react-hot-toast"
import toastStyle from "../../util/toastConfig"

type Props = {
  nft: NFTType
}

// type AuctionFormData = {
//   nftContractAddress: string
//   tokenId: string
//   startDate: Date
//   endDate: Date
//   floorPrice: string
//   buyoutPrice: string
// }

type DirectFormData = {
  nftContractAddress: string
  tokenId: string
  price: string
  // startDate: Date;
  // endDate: Date;
}

export default function SaleInfo({ nft }: Props) {
  const router = useRouter()
  // Connect to marketplace contract
  const { contract: marketplace } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace"
  )

  // useContract is a React hook that returns an object with the contract key.
  // The value of the contract key is an instance of an NFT_COLLECTION on the blockchain.
  // This instance is created from the contract address (NFT_COLLECTION_ADDRESS)
  const { contract: nftCollection } = useContract(NFT_COLLECTION_ADDRESS)

  // Hook provides an async function to create a new auction listing
  // const { mutateAsync: createAuctionListing } =
  //   useCreateAuctionListing(marketplace)

  // Hook provides an async function to create a new direct listing
  const { mutateAsync: createDirectListing } =
    useCreateDirectListing(marketplace)

  // Manage form submission state using tabs and conditional rendering
  const [tab, setTab] = useState<"direct" | "auction">("direct")

  // Manage form values using react-hook-form library: Auction form
  // const { register: registerAuction, handleSubmit: handleSubmitAuction } =
  //   useForm<AuctionFormData>({
  //     defaultValues: {
  //       nftContractAddress: NFT_COLLECTION_ADDRESS,
  //       tokenId: nft.metadata.id,
  //       startDate: new Date(),
  //       endDate: new Date(),
  //       floorPrice: "0",
  //       buyoutPrice: "0",
  //     },
  //   })

  // User requires to set marketplace approval before listing
  async function checkAndProvideApproval() {
    // Check if approval is required
    const hasApproval = await nftCollection?.call("isApprovedForAll", [
      nft.owner,
      MARKETPLACE_ADDRESS,
    ])

    // If it is, provide approval
    if (!hasApproval) {
      const txResult = await nftCollection?.call("setApprovalForAll", [
        MARKETPLACE_ADDRESS,
        true,
      ])

      if (txResult) {
        toast.success("Marketplace approval granted", {
          icon: "👍",
          style: toastStyle,
          position: "bottom-center",
        })
      }
    }

    return true
  }

  // Manage form values using react-hook-form library: Direct form
  const { register: registerDirect, handleSubmit: handleSubmitDirect } =
    useForm<DirectFormData>({
      defaultValues: {
        nftContractAddress: NFT_COLLECTION_ADDRESS,
        tokenId: nft.metadata.id,
        // startDate: new Date(),
        // endDate: new Date(),
        price: "0",
      },
    })

  // async function handleSubmissionAuction(data: AuctionFormData) {
  //   await checkAndProvideApproval()
  //   const txResult = await createAuctionListing({
  //     assetContractAddress: data.nftContractAddress,
  //     tokenId: data.tokenId,
  //     buyoutBidAmount: data.buyoutPrice,
  //     minimumBidAmount: data.floorPrice,
  //     startTimestamp: new Date(data.startDate),
  //     endTimestamp: new Date(data.endDate),
  //   })

  //   return txResult
  // }

  async function handleSubmissionDirect(data: DirectFormData) {
    await checkAndProvideApproval()

    let transactionResult: undefined | TransactionResult = undefined

    console.log(new Date(0))

    transactionResult = await marketplace?.direct.createListing({
      assetContractAddress: NFT_COLLECTION_ADDRESS, // Contract Address of the NFT
      // Maximum price, the auction will end immediately if a user pays this price.
      buyoutPricePerToken: data.price,
      // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Goerli ETH.
      currencyContractAddress: NATIVE_TOKEN_ADDRESS,
      // When the auction will be closed and no longer accept bids (6 Month)
      listingDurationInSeconds: 60 * 60 * 24 * 180,
      quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
      startTimestamp: new Date(0), // When the listing will start
      tokenId: data.tokenId, // Token ID of the NFT.
    })

    // If the transaction succeeds, take the user back to the homepage to view their listing!
    // if (transactionResult) {
    //   router.push(`/buy`)
    // }

    return transactionResult
  }

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      <div className={styles.saleInfoContainer} style={{ marginTop: -42 }}>
        <div className={profileStyles.tabs}>
          <h3
            className={`${profileStyles.tab} 
        ${tab === "direct" ? profileStyles.activeTab : ""}`}
            onClick={() => setTab("direct")}
          >
            Direct
          </h3>
        </div>

        {/* Direct listing fields */}
        <div
          className={`${
            tab === "direct"
              ? styles.activeTabContent
              : profileStyles.tabContent
          }`}
          style={{ flexDirection: "column" }}
        >
          <h4 className={styles.formSectionTitle}>Price </h4>

          {/* Input field for buyout price */}
          <legend className={styles.legend}> Price per token</legend>
          <input
            className={styles.input}
            type="number"
            step={0.000001}
            {...registerDirect("price")}
          />

          <Web3Button
            contractAddress={MARKETPLACE_ADDRESS}
            action={async () => {
              await handleSubmitDirect(handleSubmissionDirect)()
            }}
            onError={(error) => {
              toast(`Listed Failed! Reason: ${error.cause}`, {
                icon: "❌",
                style: toastStyle,
                position: "bottom-center",
              })
            }}
            onSuccess={(txResult) => {
              toast("Listed Successfully!", {
                icon: "🥳",
                style: toastStyle,
                position: "bottom-center",
              })
              router.push(`/token/${NFT_COLLECTION_ADDRESS}/${nft.metadata.id}`)
            }}
          >
            Create Direct Listing
          </Web3Button>
        </div>
      </div>
    </>
  )
}
