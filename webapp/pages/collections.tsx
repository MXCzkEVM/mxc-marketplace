// import { useContract, useNFTs } from "@thirdweb-dev/react"
import React, { useEffect, useState } from "react"
import Container from "@/components/Container/Container"
import CollectionCard from "@/components/CollectionCard"
import { CHAIN_ID } from "@/const/Network"
import { getCollectList } from "@/util/getNFT"
import SkeletonList from "@/components/Skeleton/SkeletonList"
import ApiClient from "@/util/request"
const api = new ApiClient("/")
import { Toaster } from "react-hot-toast"

export default function Overview() {
  const [collections, setCollections] = useState<any>([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      let collectionsAll: any = await api.post("/api/get-collections", {
        chainId: CHAIN_ID,
      })
      let collections = collectionsAll?.collections || []
      collections = await getCollectList(collections)
      setCollections(collections)
      console.log(collections)
      setLoading(false)
    }
    fetchData()
  }, [])

  const offs = [
    '0x4799640472292a886780E52EC5d7c1256399AE97',
    '0xc8583d516718237e7EF295bBc9E30Ed437b4dB5A',
    '0x7704870a55690599EB5ca47dA98076C3991469E5',
    "0x5d24a4cad0d7780798A0881Cab9db4b59f45617d",
    "0xD7359391CF133ddB8C95fDB6B718a3c9336d8c2F"
  ]


  return (
    <div className="collections_page">
      <Toaster></Toaster>
      <Container maxWidth="lg">
        <div className="feature mb-10">
          <h1>Featured NFTs</h1>
          <p>Discover the most outstanding NFTs in all topics of life.</p>
          <div className="nfts_feature">
            {collections && !isLoading
              ? collections.filter((c:any) => !offs.includes(c.collection)).map((nft: any, index: number) => (
                  <CollectionCard nft={nft} key={index} />
                ))
              : isLoading && <SkeletonList />}
          </div>
        </div>
      </Container>
    </div>
  )
}
