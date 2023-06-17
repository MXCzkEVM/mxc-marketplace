import {
  MediaRenderer,
  ThirdwebNftMedia,
  useContract,
  useListing,
  useActiveListings,
  useContractEvents,
  // useValidDirectListings,
  // useValidEnglishAuctions,
  Web3Button,
} from "@thirdweb-dev/react"
import React, { useState, useEffect } from "react"
import Container from "../../../components/Container/Container"
import { GetStaticProps, GetStaticPaths } from "next"
import { NFT, ThirdwebSDK } from "@thirdweb-dev/sdk"
import {
  ETHERSCAN_URL,
  MARKETPLACE_ADDRESS,
  NETWORK,
  NFT_COLLECTION_ADDRESS,
} from "../../../const/contractAddresses"
import styles from "../../../styles/Token.module.css"
import Link from "next/link"
import randomColor from "../../../util/randomColor"
import Skeleton from "../../../components/Skeleton/Skeleton"
import toast, { Toaster } from "react-hot-toast"
import toastStyle from "../../../util/toastConfig"
import { useRouter } from "next/router"
import { ethers, BigNumber } from "ethers"
import mep1004abi from "../../../const/abis/mep1004.json"

const MEP1004ContractAddr = "0xB676Db9B4788f32645B2A516323628aE99C71Ed5"
const provider = new ethers.providers.JsonRpcProvider(
  "https://wannsee-rpc.mxc.com"
)

// type Props = {
//     nft: NFT;
//     contractMetadata: any;
// };

const [randomColor1, randomColor2] = [randomColor(), randomColor()]

// { nft, contractMetadata }: Props
export default function TokenPage() {
  const [bidValue, setBidValue] = useState<string>()

  // Connect to marketplace smart contract
  // const { contract: marketplace, isLoading: loadingContract } = useContract(
  //   MARKETPLACE_ADDRESS,
  //   "marketplace-v3"
  // )
  const { contract: marketplace, isLoading: loadingContract } = useContract(
    MARKETPLACE_ADDRESS,
    "marketplace"
  )

  // Connect to NFT Collection smart contract
  const { contract, contract: nftCollection } = useContract(
    NFT_COLLECTION_ADDRESS
  )

  const [nft, SetNFT] = useState<any>({ metadata: {}, owner: null })
  const [contractMetadata, SetContractMetadata] = useState<any>({})

  const router = useRouter()
  const { contractAddress, tokenId } = router.query as {
    tokenId: string
    contractAddress: string
  }

  useEffect(() => {
    if (!tokenId) {
      return
    }
    const fetchData = async () => {
      const sdk = new ThirdwebSDK(NETWORK)
      const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS)
      let _id = tokenId as string
      let nft = await contract.erc721.get(_id)
      let contractMetadata
      try {
        contractMetadata = await contract.metadata.get()
      } catch (e) {}
      SetNFT(nft)
      SetContractMetadata(contractMetadata)
    }
    fetchData()
  }, [tokenId])

  // const { data: listing, isLoading: loadingListing } = useListing(
  //   marketplace,
  //   tokenId
  // )
  const { data: listings, isLoading: loadingListing } =
    useActiveListings(marketplace)

  let nft_info: any = {}
  let nft_id = nft?.metadata?.id || null
  if (nft_id && listings?.length) {
    let listing = listings?.filter((item) => item.tokenId.toString() == nft_id)
    nft_info = listing[listing.length - 1] || {}
  }

  // console.log(nft_info)

  // 2. Load if the NFT is for auction
  // const { data: auctionListing, isLoading: loadingAuction } =
  //   useValidEnglishAuctions(marketplace, {
  //     tokenContract: NFT_COLLECTION_ADDRESS,
  //     tokenId: nft.metadata.id,
  //   })

  // Load historical transfer events: TODO - more event types like sale
  const { data: transferEvents, isLoading: loadingTransferEvents } =
    useContractEvents(nftCollection, "Transfer", {
      queryFilter: {
        filters: {
          tokenId: nft.metadata.id,
        },
        order: "desc",
      },
    })

  async function buyListing(nft_info: any) {
    let txResult

    try {
      // Simple one-liner for buying the NFT
      txResult = await marketplace?.buyoutListing(nft_info.id, 1)
      alert("NFT bought successfully!")
    } catch (error) {
      console.error(error)
      alert(error)
    }

    return txResult
  }

  const getAttrCss = (item: any) => {
    if (item.trait_type == "Location Proofs") {
      return "csp"
    }
    return ""
  }

  const clickAttr = async (item: any) => {
    if (item.trait_type == "Location Proofs") {
      const contract = new ethers.Contract(
        MEP1004ContractAddr,
        mep1004abi,
        provider
      )
      let { MEP1002TokenId } = await contract.latestLocationProofs(tokenId)
      let hexId = MEP1002TokenId._hex.replace("0x", "")
      window.open(
        `https://wannsee-explorer.mxc.com/mapper?hexid=${hexId}`,
        "_blank"
      )
    }
  }

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      {nft.owner ? (
        <Container maxWidth="lg">
          <div className={styles.container}>
            <div className={styles.metadataContainer}>
              <ThirdwebNftMedia
                metadata={nft.metadata}
                className={styles.image}
              />

              <div className={styles.descriptionContainer}>
                <h3 className={styles.descriptionTitle}>Description</h3>
                <p className={styles.description}>{nft.metadata.description}</p>

                <h3 className={styles.descriptionTitle}>Traits</h3>

                <div className={styles.traitsContainer}>
                  {nft?.metadata?.attributes.map((item: any, index: number) => (
                    <div
                      onClick={() => clickAttr(item)}
                      className={`${styles.traitContainer} ${getAttrCss(item)}`}
                      key={index}
                    >
                      <p className={styles.traitName}>{item.trait_type}</p>
                      <p className={styles.traitValue}>
                        {item.value?.toString() || ""}
                      </p>
                    </div>
                  ))}
                </div>

                <h3 className={styles.descriptionTitle}>History</h3>

                <div className={styles.traitsContainer}>
                  {transferEvents?.map((event, index) => (
                    <div
                      // event.transaction.transactionHash
                      key={index}
                      className={styles.eventsContainer}
                    >
                      <div className={styles.eventContainer}>
                        <p className={styles.traitName}>Event</p>
                        <p className={styles.traitValue}>
                          {
                            // if last event in array, then it's a mint
                            index === transferEvents.length - 1
                              ? "Mint"
                              : "Transfer"
                          }
                        </p>
                      </div>

                      <div className={styles.eventContainer}>
                        <p className={styles.traitName}>From</p>
                        <p className={styles.traitValue}>
                          {event.data.from?.slice(0, 4)}
                          ...
                          {event.data.from?.slice(-2)}
                        </p>
                      </div>

                      <div className={styles.eventContainer}>
                        <p className={styles.traitName}>To</p>
                        <p className={styles.traitValue}>
                          {event.data.to?.slice(0, 4)}
                          ...
                          {event.data.to?.slice(-2)}
                        </p>
                      </div>

                      <div className={styles.eventContainer}>
                        <Link
                          className={styles.txHashArrow}
                          href={`${ETHERSCAN_URL}/tx/${event.transaction.transactionHash}`}
                          target="_blank"
                        >
                          ↗
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.listingContainer}>
              {contractMetadata && (
                <div className={styles.contractMetadataContainer}>
                  <MediaRenderer
                    src={contractMetadata.image}
                    className={styles.collectionImage}
                  />
                  <p className={styles.collectionName}>
                    {contractMetadata.name}
                  </p>
                </div>
              )}
              <h1 className={styles.title}>{nft.metadata.name}</h1>
              <p className={styles.collectionName}>
                Token ID #{nft.metadata.id}
              </p>

              <Link
                href={`/profile/${nft.owner}`}
                className={styles.nftOwnerContainer}
              >
                {/* Random linear gradient circle shape */}
                <div
                  className={styles.nftOwnerImage}
                  style={{
                    background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
                  }}
                />
                <div className={styles.nftOwnerInfo}>
                  <p className={styles.label}>Current Owner</p>
                  <p className={styles.nftOwnerAddress}>
                    {nft.owner.slice(0, 8)}...
                    {nft.owner.slice(-4)}
                  </p>
                </div>
              </Link>

              <div className={styles.pricingContainer}>
                {/* Pricing information */}
                <div className={styles.pricingInfo}>
                  <p className={styles.label}>Price</p>
                  <div className={styles.pricingValue}>
                    {loadingContract || loadingListing ? (
                      <Skeleton width="120" height="24" />
                    ) : (
                      <>
                        {nft_info.buyoutCurrencyValuePerToken ? (
                          <>
                            {nft_info.buyoutCurrencyValuePerToken.displayValue}
                            {" " + nft_info.buyoutCurrencyValuePerToken.symbol}
                          </>
                        ) : (
                          "Not for sale"
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {loadingContract ? (
                <Skeleton width="100%" height="164" />
              ) : (
                <>
                  {nft_info.buyoutCurrencyValuePerToken ? (
                    <Web3Button
                      contractAddress={MARKETPLACE_ADDRESS}
                      action={async () => await buyListing(nft_info)}
                      className={styles.btn}
                      onSuccess={() => {
                        toast(`Purchase success!`, {
                          icon: "✅",
                          style: toastStyle,
                          position: "bottom-center",
                        })
                      }}
                      onError={(e) => {
                        toast(`Purchase failed! Reason: ${e.message}`, {
                          icon: "❌",
                          style: toastStyle,
                          position: "bottom-center",
                        })
                      }}
                    >
                      Buy at asking price
                    </Web3Button>
                  ) : null}

                  {/* <div
                    className={`${styles.listingTimeContainer} ${styles.or}`}
                  >
                    <p className={styles.listingTime}>or</p>
                  </div> */}

                  {/* <input
                    className={styles.input}
                    defaultValue={
                      auctionListing?.[0]?.minimumBidCurrencyValue
                        ?.displayValue || 0
                    }
                    type="number"
                    step={0.000001}
                    onChange={(e) => {
                      setBidValue(e.target.value)
                    }}
                  />

                  <Web3Button
                    contractAddress={MARKETPLACE_ADDRESS}
                    action={async () => await createBidOrOffer()}
                    className={styles.btn}
                    onSuccess={() => {
                      toast(`Bid success!`, {
                        icon: "✅",
                        style: toastStyle,
                        position: "bottom-center",
                      })
                    }}
                    onError={(e) => {
                      toast(`Bid failed! Reason: ${e.message}`, {
                        icon: "❌",
                        style: toastStyle,
                        position: "bottom-center",
                      })
                    }}
                  >
                    Place bid
                  </Web3Button> */}
                </>
              )}
            </div>
          </div>
        </Container>
      ) : null}
    </>
  )
}

// export const getStaticProps: GetStaticProps = async (context) => {
//   const tokenId = context.params?.tokenId as string;
//   const sdk = new ThirdwebSDK(NETWORK);
//   const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
//   const nft = await contract.erc721.get(tokenId);
//   let contractMetadata;
//   try {
//     contractMetadata = await contract.metadata.get();
//   } catch (e) {}
//   return {
//     props: {
//       nft,
//       contractMetadata: contractMetadata || null,
//     },
//     revalidate: 1, // https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
//   };
// };

// export const getStaticPaths: GetStaticPaths = async () => {
//   const sdk = new ThirdwebSDK(NETWORK);
//   const contract = await sdk.getContract(NFT_COLLECTION_ADDRESS);
//   const nfts = await contract.erc721.getAll();
//   const paths = nfts.map((nft) => {
//     return {
//       params: {
//         contractAddress: NFT_COLLECTION_ADDRESS,
//         tokenId: nft.metadata.id,
//       },
//     };
//   });
//   return {
//     paths,
//     fallback: "blocking", // can also be true or 'blocking'
//   };
// };
