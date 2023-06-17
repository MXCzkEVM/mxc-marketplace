import { useRouter } from "next/router"
import React, { useState, useEffect } from "react"
import Container from "../../components/Container/Container"
import WhiteHeaderComponent from "../../components/collection/whiteheader-component"
import CollectionService from "../../service/collection"
import BannerComponent from "../../components/collection/banner"
import CollectionMain from "../../components/collection/collectionmain"

export default function CollectPage() {
  const [collectionData, setCollectionData] = useState(null)
  const [cartItems, setCartItems] = useState([])

  const router = useRouter()
  const { address } = router.query

  useEffect(() => {
    const fetchData = async () => {
      if (!address) {
        return
      }
      try {
        const data: any = await CollectionService.CollectionData(address)
        setCollectionData(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [address])

  return (
    <Container maxWidth="lg">
      <div>
        {/* <WhiteHeaderComponent
          collectionData={collectionData}
          cartItems={cartItems}
          setCartItems={setCartItems}
        /> */}
        {collectionData && <BannerComponent collectionData={collectionData} />}
        {collectionData && (
          <CollectionMain
            collectionData={collectionData}
            setCollectionData={setCollectionData}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        )}
      </div>
    </Container>
  )
}
