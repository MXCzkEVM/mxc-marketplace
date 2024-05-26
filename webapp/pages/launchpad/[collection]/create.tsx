import Router, { useRouter } from "next/router"
import Link from "next/link"
import React, { useState, useEffect, useRef, useMemo } from "react"
import Select from "react-select"
import { toast } from "react-toastify"
import {
  Web3Button,
  useAddress,
  useContract,
  useContractWrite,
  useContractRead,
} from "@thirdweb-dev/react"
import Container from "@/components/Container/Container"
import uploadIcon from "@/assets/imgs/upload.png"
import plusIcon from "@/assets/svgs/plus.svg"
import closeIcon from "@/assets/svgs/close.svg"
import { storeImage, storeJson } from "@/util/uploadToPinata"
import { getCollectInfo, getCollectList } from "@/util/getNFT"
import { CHAIN_ID, provider } from "@/const/Network"
import { ABI, CONTRACTS_MAP } from "@/const/Address"
import { useTranslation } from "react-i18next"

import { IPFS_GATEWAY, version, zeroAddress } from "@/const/Local"
import ApiClient from "@/util/request"
import { useSession, getSession } from "next-auth/react"
import BigNumber from 'bignumber.js'
import { getChainRPC } from "@thirdweb-dev/chains"
import { Contract } from 'ethers'
import { ButtonForV3 } from "@/components/v2button"
import { ButtonForV2 } from "@/components/v1button"
import { BurnMintButton } from "@/components/BurnMintButton"
const api = new ApiClient("/")

export default function AssetCrearePage() {
  const imageRef = useRef<any>(null)
  const router = useRouter()

  const collection_address = router.query.collection as string
  const [collection, setCollection] = useState<any>(null)

  const [name, setName] = useState("")
  const [nameError, setNameError] = useState<any>(null)
  const [nftImage, setImage] = useState(null)
  const [nftImageFile, setImageFile] = useState<any>(null)
  const [description, setDescription] = useState("")
  const [isRealWorldNFT, setSwitch] = useState(false)
  const [mortgage, setMortgage] = useState('')
  const { data: session } = useSession()

  const { t } = useTranslation()

  // traits
  const [traits, setTraits] = useState<any>([
    { trait_type: "Year", value: "2023" },
    {
      trait_type: "Producer",
      value: "MXC DAO",
    },
    {
      trait_type: "Tag",
      value: "MXC loT Tag",
    },
    {
      trait_type: "Network",
      value: "NEO and M2Pro",
    },
    ...(session
      ? [{ trait_type: 'Twitter', value: session.user?.name, edit: false }]
      : []),
    {
      trait_type: "Location Proofs",
      value: "MEP-1002",
    },
    {
      trait_type: "Source",
      value: "MXC Community Design",
    },
  ])
  const [editingIndex, setEditingIndex] = useState(null)
  const [trait_type, setTraitType] = useState("")
  const [value, setValue] = useState("")
  const [userCollections, setUserCollections] = useState<any>([])
  const [version, setVersion] = useState()
  const [loading, setLoading] = useState(false)

  const address = useAddress()

  const isVersion2 = typeof version === 'undefined'

  const { contract: xsdContract } = useContract(
    CONTRACTS_MAP['XSD'],
    ABI.erc20
  )

  const allowanceParams = [address || zeroAddress, collection_address || zeroAddress]

  useEffect(() => {
    const fetchData = async () => {
      if (collection_address == zeroAddress) {
        return
      }
      let collectionsItem: any = await api.post("/api/get-collection-launchpad", {
        chainId: CHAIN_ID,
        collection_id: collection_address,
      })
      let collection = collectionsItem?.collection || {}
      let nwData = await getCollectInfo(collection)
      setCollection(nwData)
    }
    fetchData()
  }, [collection_address])
  
  async function queryVersion() {
    try {
      setVersion(undefined)
      if (!collection_address)
        return
      const contract = new Contract(collection_address, ABI.collection, provider)
      const version = await contract.getVersion()
      setVersion(version || undefined)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  useEffect(() => {
    queryVersion()
  }, [collection_address])

  const { data: allowance, isLoading, refetch: refetchAllowance } = useContractRead(
    xsdContract,
    'allowance',
    allowanceParams
  )
  const { data: xsdBalance, refetch: refetchXsdBalance } = useContractRead(
    xsdContract,
    'balanceOf',
    [address]
  )


  const { mutateAsync: approveXSD } = useContractWrite(xsdContract, "approve")

  const toMortgage = new BigNumber(mortgage).multipliedBy(10 ** 18).toFixed(0)


  useEffect(() => {
    if (isRealWorldNFT)
      // 当 switch 打开时执行一些操作
      console.log("Switch is on")
  }, [isRealWorldNFT])

  useEffect(() => {
    const fetchData = async () => {
      let myCollections: any = await api.post("/api/get-collections", {
        chainId: CHAIN_ID,
        creator: address,
      })
      let userCollections = myCollections?.collections || []
      userCollections = await getCollectList(userCollections)
      setUserCollections(userCollections)
    }
    if (address !== zeroAddress) {
      fetchData()
    }
  }, [address])

  const removeImage = () => {
    setImage(null)
    setImageFile(null)
  }
  const handleImageSelect = (e: any) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]

      setImageFile(file)

      const reader = new FileReader()
      reader.onload = function (e: any) {
        setImage(e.target.result)
      }

      reader.readAsDataURL(file)
    }
  }

  const createItem = async () => {

    if (mortgage && xsdBalance.lt(toMortgage)) {
      toast.warn(t("You don t have enough XSD"))
      return
    }
    if (!name) {
      toast.warn(t("Please type your collection name"))
      return
    }



    const formData = {
      image: collection.nft,
      name: collection.nftName,
      // external_link,
      description: collection.nftDescription,
      attributes: collection.traits,
      isRealWorldNFT,
    }

    const json_data = JSON.stringify({
      pinataOptions: {},
      pinataMetadata: {
        name,
      },
      pinataContent: formData,
    })

    let jsonIpfs = await storeJson(json_data)
    if (!jsonIpfs) {
      toast.error(t("Upload json to ipfs failed"))
      return
    }
    return jsonIpfs
  }

  const handleAddOrEditTrait = (e: any) => {
    e.preventDefault()
    if (editingIndex !== null) {
      const newTraits: any = [...traits]
      newTraits[editingIndex] = { trait_type, value }
      setTraits(newTraits)
      setEditingIndex(null)
    } else {
      setTraits([...traits, { trait_type, value }])
    }
    setTraitType("")
    setValue("")
  }

  const handleEditTrait = (index: any): void => {
    setTraitType(traits[index].trait_type)
    setValue(traits[index].value)
    setEditingIndex(index)
  }

  const handleDeleteTrait = (index: any) => {
    setTraits(traits.filter((_: any, i: any) => i !== index))
  }


  const validateName = () => {
    if (name.length === 0) {
      setNameError(t("This field is required"))
    } else {
      setNameError(null)
    }
  }

  async function approve() {
    try {
      // Simple one-liner for buying the NFT
      const res = await approveXSD({ args: [collection_address, toMortgage] })
      return res
    } catch (error) {
      // console.error(error)
      console.log(error)
      toast.error(t("XSD approve failed"))
    }
  }

  function renderApprove() {
    return (
      <Web3Button
        contractAddress={CONTRACTS_MAP['XSD']}
        contractAbi={ABI.erc20}
        action={approve}
        className="list_btn"
        onSuccess={() => {
          refetchAllowance()
          toast.success(t("XSD Approved click button to continue"))
        }}
      >
        {t("Approve for XSD")}
      </Web3Button>
    )
  }

  function renderButtonV2() {
    return <ButtonForV2
      address={collection_address} 
      resolveIpfs={createItem}
      onSuccess={refetchXsdBalance}
    />
  }
  function renderButtonV3() {
    return <BurnMintButton 
      address={collection_address} 
      resolveIpfs={createItem}
      onSuccess={refetchXsdBalance}
    />
  }

  function renderCreate() {
    return isVersion2 ? renderButtonV2() : renderButtonV3()
  }

  const inApprove = (mortgage && allowance ? allowance.lt(toMortgage) : false)
  return (
    <Container maxWidth="lg">
      <div className="create_page">
        <div className="inner">
          <div className="title">Mint Launchpad Item</div>
          <div className="inputGroup">
            <div className="inputTitle">{t("Item Name")} *</div>
            <div className="inputWrapper">
              <input
                className="input"
                maxLength={30}
                placeholder={t("Item Name")}
                value={collection.nftName || 'none'}
                disabled
              />
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">{t("NFT Image")}</div>
            <div className="inputSubTitle">
              {/* {t("This image will also be used for navigation")} */}
            </div>
            <div className="inputWrapper">
              <div className="uploadBox">
                {/* https://gateway.pinata.cloud/ipfs/QmS8VLVs416nd8zJmcu6zifXjSRY3mgybYMQej4npWHdVD */}
                {/* https://gateway.pinata.cloud/ipfs/QmZ1uCGaF5thPBkjuGFFCVQdNgESYbhd5zJCJFYhg33PtB */}                
                <img src={collection?.profile} />
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">{t("Description")}</div>
            <div className="inputSubTitle">
              {t("The description will be inclueded on the item")}
            </div>
            <div className="inputWrapper">
              <textarea
                className={`input longInput`}
                maxLength={1000}
                placeholder=""
                disabled
                value={collection?.nftDescription || 'none'}
              />
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">Traits</div>
            <div className="inputSubTitle">
              {t("Textual traits that show up as rectangles")}
            </div>
            <div className="inputWrapper">
              <div className="p-4 bg-black text-white shadow-md rounded">
                {traits.map(({ trait_type, value, edit }: any, i: any) => (
                  <div key={i} className="flex justify-between mb-2">
                    <p>
                      <span className="font-semibold">{trait_type}</span>:{" "}
                      {value}
                    </p>


                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* <div className="inputGroup">
            <div className="inputTitle flex_sc">
              <div className="t">{t("Real-World Collectables")}</div>
              <div className="flex items-center justify-start">
                <label
                  htmlFor="toggle"
                  className={`relative inline-block w-12 h-6 transition-all duration-200 ease-in-out bg-gray-400 rounded-full shadow-inner cursor-pointer ${isRealWorldNFT && "bg-green-400"
                    }`}
                >
                  <input
                    id="toggle"
                    type="checkbox"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    checked={isRealWorldNFT}
                    onChange={() => setSwitch(!isRealWorldNFT)}
                  />
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 transition-all duration-200 ease-in-out bg-white rounded-full shadow ${isRealWorldNFT && "transform translate-x-6"
                      }`}
                  />
                </label>
              </div>
            </div>
            <div className="inputSubTitle">
              {t("The proofs of location for IoT NFTs")} :
              <Link
                href={`https://www.youtube.com/watch?v=AcJp5PE4TDg`}
                passHref
                legacyBehavior
              >
                <a target="_blank" rel="noopener noreferrer">
                  {t("MXC N3XUS Provisioning Guide")}
                </a>
              </Link>
            </div>
          </div> */}

          {/* {!isVersion2 && <div className="inputGroup">
            <div className="inputTitle">{t("Mortgage Input Title")}</div>
            <div className="inputSubTitle">
              {t("Mortgage Input Des")}
            </div>

            <div className="inputWrapper">
              <input
                className={`input ${nameError && "hasError"}`}
                maxLength={30}
                type="number"
                placeholder={'0.00'}
                min="0"
                value={mortgage}
                onChange={(e) => Number(e.target.value || 0) >= 0 && setMortgage(e.target.value)}
                onBlur={validateName}
              />
            </div>
          </div>} */}




          {collection_address && (
            <div className="subwrap flex_c mt-5">
              {inApprove ? renderApprove() : renderCreate()}
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
