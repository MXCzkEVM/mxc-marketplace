import Router, { useRouter } from "next/router"
import Link from "next/link"
import React, { useState, useEffect, useRef } from "react"
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
import { getCollectList } from "@/util/getNFT"
import { CHAIN_ID } from "@/const/Network"
import { ABI, CONTRACTS_MAP } from "@/const/Address"
import { useTranslation } from "react-i18next"

import { version, zeroAddress } from "@/const/Local"
import ApiClient from "@/util/request"
import { useSession, getSession } from "next-auth/react"
import BigNumber from 'bignumber.js'
const api = new ApiClient("/")

export default function AssetCrearePage() {
  const imageRef = useRef<any>(null)

  const [name, setName] = useState("")
  const [nameError, setNameError] = useState<any>(null)
  const [nftImage, setImage] = useState(null)
  const [nftImageFile, setImageFile] = useState<any>(null)
  const [description, setDescription] = useState("")
  const [collection_address, setCollection] = useState("")
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
    // {
    //   trait_type: "Social Handle",
    //   value: "@MXCFoundation",
    // },
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

  const address = useAddress()

  const { contract: colContract } = useContract(
    collection_address,
    ABI.collection
  )
  const { contract: xsdContract } = useContract(
    CONTRACTS_MAP['XSD'],
    ABI.erc20
  )

  const allowanceParams = [address || zeroAddress, collection_address || zeroAddress]
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


  const { mutateAsync: mintNFT } = useContractWrite(colContract, "mint")
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
    console.log(xsdBalance)

    if (mortgage && xsdBalance.lt(toMortgage)) {
      toast.warn(t("You don t have enough XSD"))
      return
    }
    if (!name) {
      toast.warn(t("Please type your collection name"))
      return
    }

    let image_ipfs: any = ""
    if (nftImageFile) {
      const formData = new FormData()
      const metadata = JSON.stringify({
        name: `${version}_${nftImageFile.name}`,
      })
      formData.append("pinataMetadata", metadata)
      formData.append("file", nftImageFile)
      image_ipfs = await storeImage(formData)
    }

    const formData = {
      image: image_ipfs,
      name,
      // external_link,
      description,
      attributes: traits,
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

    // console.log(jsonIpfs, "jsonIpfs")

    let txResult
    try {
      // Simple one-liner for buying the NFT
      const xsd = mortgage ? toMortgage : 0
      txResult = await mintNFT({
        args: [`ipfs://${jsonIpfs}`, xsd],
      })
      toast.success("NFT item create successfully!")
      Router.push(`/collection/${collection_address}`)
    } catch (error) {
      // console.error(error)
      console.log(error)
      toast.error(t("NFT item create failed"))
    }

    return txResult
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

  const onChangeCollection = (e: any) => {
    if (e?.collection) {
      setCollection(e.collection as string)
    } else {
      setCollection("")
    }
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

  function renderCreate() {
    return (
      <Web3Button
        contractAddress={collection_address}
        contractAbi={ABI.collection}
        action={async () => await createItem()}
        isDisabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white"
        onSuccess={() => {
          refetchXsdBalance()
        }}
      >
        {t("Create item")}
      </Web3Button>
    )
  }

  const inApprove = (mortgage && allowance ? allowance.lt(toMortgage) : false)
  return (
    <Container maxWidth="lg">
      <div className="create_page">
        <div className="inner">
          <div className="title">Create New Item</div>
          <div className="inputGroup">
            <div className="inputTitle">{t("Item Name")} *</div>
            <div className="inputWrapper">
              <input
                className={`input ${nameError && "hasError"}`}
                maxLength={30}
                placeholder={t("Item Name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validateName}
              />
              <div className="flex_sc">
                {(nameError && <div className="error">{nameError}</div>) || (
                  <span className="hide"></span>
                )}
                <div className="lengthIndicator">{name.length}/30</div>
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">{t("NFT Image")}</div>
            <div className="inputSubTitle">
              {t("This image will also be used for navigation")}
            </div>
            <div className="inputWrapper">
              <div className="uploadBox">
                {nftImage ? (
                  <>
                    <img src={nftImage} />
                    <div className="removeOverlay">
                      <div className="removeIcon" onClick={removeImage}>
                        <img src={closeIcon.src} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="uploadOverlay"
                    onClick={() => imageRef.current?.click()}
                  >
                    <input
                      ref={imageRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageSelect}
                    />
                    <div className="upload">
                      <div className="uploadInner">
                        <img src={uploadIcon.src as any} />
                      </div>
                      <div className="plusIcon">
                        <img src={plusIcon.src} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* <div className="inputGroup">
            <div className="inputTitle">External link</div>
            <div className="inputSubTitle">
              MXC loT NFT marketplace will include a link to this URL on this
              item&apos;s detail page, so that users can click to learn more
              about it.You are welcome to link to your own webpage with more
              details.
            </div>
            <div className="inputWrapper">
              <input
                className={`input`}
                maxLength={30}
                placeholder="https://yoursite.io/item/123"
                value={external_link}
                onChange={(e) => setExternal(e.target.value)}
              />
            </div>
          </div> */}

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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">Collection *</div>
            <div className="inputSubTitle">
              {t("This is the collection where your item will appear")}
            </div>
            <div className="inputWrapper">
              <Select
                options={userCollections}
                isClearable
                // isSearchable
                defaultInputValue={collection_address}
                placeholder="Select your collection"
                onChange={onChangeCollection}
                formatOptionLabel={({ cover, collection, name }: any) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={cover}
                      alt={collection}
                      style={{ marginRight: 10, height: 20, width: 20 }}
                    />
                    <span className="text-zinc-950	">{name}</span>
                  </div>
                )}
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


                    <div>
                      {edit !== false && (
                        <button
                          className="mr-2 text-yellow-500"
                          onClick={() => handleEditTrait(i)}
                        >
                          {t("Edit")}
                        </button>
                      )}
                      <button
                        className="text-red-500"
                        onClick={() => handleDeleteTrait(i)}
                      >
                        {t("Delete")}
                      </button>
                    </div>

                  </div>
                ))}

                <form onSubmit={handleAddOrEditTrait}>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={t("Trait Key")}
                      value={trait_type}
                      onChange={(e) => setTraitType(e.target.value)}
                      className="p-2 bg-gray-800 text-white border rounded w-1/2"
                      required
                    />
                    <input
                      type="text"
                      placeholder={t("Trait Value")}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="p-2 bg-gray-800 text-white border rounded w-1/2"
                      required
                    />
                  </div>
                  <div>
                    <button
                      className="py-2 px-4 bg-yellow-500 text-black rounded"
                      type="submit"
                    >
                      {editingIndex !== null ? "Update Trait" : "Add Trait"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="inputGroup">
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
          </div>

          <div className="inputGroup">
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
          </div>



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
