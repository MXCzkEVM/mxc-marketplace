import { useRouter } from "next/router"
import Router from "next/router"
import React, { useState, useEffect, useRef } from "react"
import {
  Web3Button,
  useAddress,
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react"
import { toast } from "react-toastify"
import { ChainId, ThirdwebSDK } from "@thirdweb-dev/sdk"
import { storeImage } from "@/util/uploadToPinata"
import { NETWORK } from "@/const/Network"
import FormData from "form-data"
import axios from "axios"

import { ethers } from "ethers"
import Container from "@/components/Container/Container"
import PriceInput from "@/components/PriceInput"
import uploadIcon from "@/assets/imgs/upload.png"
import plusIcon from "@/assets/svgs/plus.svg"
import closeIcon from "@/assets/svgs/close.svg"
import ApiClient from "@/util/request"
const api = new ApiClient("/")

import {
  CONTRACTS_MAP,
  ABI,
  instanceCollectionFactory,
  CHAIN_ID,
} from "@/const/Network"
import {
  CategoryArray,
  CategoryMap,
  version,
  IPFS_GATEWAY,
} from "@/const/Local"

const CollectDetail = (props: any) => {
  const collectionDta = props.collectionDta || {}
  const type = props.type || "create"
  const isEdit = type === "edit"

  const coverRef = useRef<any>(null)
  const profileRef = useRef<any>(null)

  const [name, setName] = useState("")
  const [nameError, setNameError] = useState<any>(null)
  const [Cover, setCover] = useState<any>(null)
  const [coverFile, setCoverFile] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [profileImage, setprofileImage] = useState<any>(null)
  const [description, setDescription] = useState("")
  const [descriptionError, setDescriptionError] = useState<any>(null)
  const [domainValue, setDomainValue] = useState<any>()
  const [categoryValue, setCategory] = useState<any>()
  const [site, setSite] = useState("")
  const [social, setSocial] = useState("")
  const [tags, setTags] = useState<any>([])
  const [inputValue, setInputValue] = useState("")
  const [royalty, setRoyalty] = useState<any>("")
  const [royaltyRecipient, setRoyaltyRecipient] = useState("")

  const [editLoading, setEditLoading] = useState(false)

  const address = useAddress()
  // "Techcode.MXC", "HelloWorld.MXC"
  const domains: any = []

  const { contract } = useContract(
    CONTRACTS_MAP.COLLECTION_FACTORY,
    ABI.collectionFactory
  )
  const { mutateAsync: createCollection } = useContractWrite(
    contract,
    "createCollection"
  )

  useEffect(() => {
    if (isEdit && Object.keys(collectionDta).length) {
      setName(collectionDta.name)
      setCover(collectionDta.cover)
      setProfile(collectionDta.profile)
      setDescription(collectionDta.description)
      setCategory(collectionDta.category)
      setSocial(collectionDta.social)
      setSite(collectionDta.site)
      setRoyaltyRecipient(collectionDta.royaltyRecipient)
      setRoyalty(collectionDta.royaltiesCutPerMillion)
      setTags(collectionDta.tags)
    }
  }, [collectionDta])

  useEffect(() => {
    if (address && !royaltyRecipient) {
      setRoyaltyRecipient(address)
    }
  }, [])

  useEffect(() => {
    if (address && !royaltyRecipient) {
      setRoyaltyRecipient(address)
    }
  }, [])

  const onChangeDomain = (e: any) => {
    setDomainValue(e.target.value as string)
  }

  const onChangeCategory = (e: any) => {
    setCategory(e.target.value as string)
  }

  const removeCover = () => {
    setCover(null)
    setCoverFile(null)
  }

  const removeProfile = () => {
    setProfile(null)
    setprofileImage(null)
  }

  const handleCoverSelect = (e: any) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]

      setCoverFile(file)

      const reader = new FileReader()
      reader.onload = function (e: any) {
        setCover(e.target.result)
      }

      reader.readAsDataURL(file)
    }
  }

  const handleProfileSelect = (e: any) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]

      setprofileImage(file)

      const reader = new FileReader()
      reader.onload = function (e: any) {
        setProfile(e.target.result)
      }

      reader.readAsDataURL(file)
    }
  }

  const validateName = () => {
    if (name.length === 0) {
      setNameError("This field is required")
    } else {
      setNameError(null)
    }
  }

  const validateDescription = () => {
    if (description.length === 0) {
      setDescriptionError("This field is required")
    } else {
      setDescriptionError(null)
    }
  }

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: any) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      // 创建新标签
      if (tags.length >= 5) {
        return // 最多生成5个标签
      }

      const newTag = {
        id: Date.now(),
        name: inputValue.trim(),
      }

      setTags([...tags, newTag])
      setInputValue("")
    }
  }

  const handleTagDelete = (tagId: any) => {
    const updatedTags = tags.filter((tag: any) => tag.id !== tagId)
    setTags(updatedTags)
  }

  async function editCollection() {
    setEditLoading(true)
    if (!name) {
      toast.warn("Please type your collection name.")
      return
    }
    if (!description) {
      toast.warn("Please type your collection description.")
      return
    }
    if (!royaltyRecipient) {
      toast.warn("Please type your collection royalty recipient.")
      return
    }
    if (!ethers.utils.isAddress(royaltyRecipient)) {
      toast.warn("Please type a correct address.")
      return
    }
    let cover_ipfs: any = ""
    let profile_ipfs: any = ""
    if (coverFile) {
      const formData = new FormData()
      const metadata = JSON.stringify({
        name: `${version}_${coverFile.name}`,
      })
      formData.append("pinataMetadata", metadata)
      formData.append("file", coverFile)
      cover_ipfs = await storeImage(formData)
    } else {
      cover_ipfs = (Cover && Cover.replace(IPFS_GATEWAY, "")) || ""
    }
    if (profileImage) {
      const formData = new FormData()
      const metadata = JSON.stringify({
        name: `${version}_${profileImage.name}`,
      })
      formData.append("pinataMetadata", metadata)
      formData.append("file", profileImage)
      profile_ipfs = await storeImage(formData)
    } else {
      profile_ipfs = profile && profile.replace(IPFS_GATEWAY, "")
    }

    if (!cover_ipfs) {
      toast.warn("Please upload a cover image.")
      return
    }
    if (!profile_ipfs) {
      toast.warn("Please upload a profile image.")
      return
    }

    const web3 = require("web3")
    const signedMessage = await window.ethereum.request({
      method: "personal_sign",
      params: [web3.utils.utf8ToHex(collectionDta.collection), address],
    })

    let formData: any = {
      cover: cover_ipfs,
      profile: profile_ipfs,
      name,
      description,
      url: domainValue || "",
      category: categoryValue,
      tags: JSON.stringify(tags),
      site,
      social,
    }

    let res: any = await api.post("/api/edit-collection", {
      chainId: CHAIN_ID,
      collection: collectionDta.collection,
      signedMessage,
      formData,
    })

    if (res.status) {
      toast.success("NFT Collection modify successfully!")
      Router.push(`/profile`)
    }

    setEditLoading(false)
  }

  async function saveCollection() {
    if (!name) {
      toast.warn("Please type your collection name.")
      return
    }
    if (!description) {
      toast.warn("Please type your collection description.")
      return
    }
    if (!royaltyRecipient) {
      toast.warn("Please type your collection royalty recipient.")
      return
    }
    if (!ethers.utils.isAddress(royaltyRecipient)) {
      toast.warn("Please type a correct address.")
      return
    }

    let cover_ipfs: any = ""
    let profile_ipfs: any = ""
    if (coverFile) {
      const formData = new FormData()
      const metadata = JSON.stringify({
        name: `${version}_${coverFile.name}`,
      })
      formData.append("pinataMetadata", metadata)
      formData.append("file", coverFile)
      cover_ipfs = await storeImage(formData)
    }
    if (profileImage) {
      const formData = new FormData()
      const metadata = JSON.stringify({
        name: `${version}_${profileImage.name}`,
      })
      formData.append("pinataMetadata", metadata)
      formData.append("file", profileImage)
      profile_ipfs = await storeImage(formData)
    }

    if (!cover_ipfs) {
      toast.warn("Please upload a cover image.")
      return
    }
    if (!profile_ipfs) {
      toast.warn("Please upload a profile image.")
      return
    }

    let formData: any = {
      cover: cover_ipfs,
      profile: profile_ipfs,
      name,
      description,
      royaltyRecipient,
      royaltiesCutPerMillion: royalty * 100,
      url: domainValue || "",
      category: categoryValue,
      tags: JSON.stringify(tags),
      site,
      social,
      chainId: CHAIN_ID,
      creator: address,
    }

    let txResult
    try {
      const collectionFactory = await instanceCollectionFactory()
      let filterCollection = collectionFactory.filters.newCollectionEvent(
        null,
        address
      )
      collectionFactory.once(
        filterCollection,
        async (collectionAddress, owner) => {
          if (owner == address) {
            formData.collection = collectionAddress

            let res = await axios.post("/api/create-collection", {
              data: formData,
            })
            if (res.data.status !== 200) {
              toast.error("API call failed!")
              return
            }

            toast.success("NFT Collection create successfully!")
            Router.push(`/profile`)
          }
        }
      )

      // Simple one-liner for buying the NFT
      txResult = await createCollection({
        args: [
          formData.name,
          formData.name,
          formData.royaltiesCutPerMillion,
          formData.royaltyRecipient,
        ],
      })
    } catch (error) {
      // console.error(error)
      console.log(error)
      toast.error(`NFT Collection create failed`)
    }

    return txResult
  }

  return (
    <Container maxWidth="lg">
      <div className="create_page">
        <div className="inner">
          <div className="title">Collection Detail</div>

          <div className="inputGroup">
            <div className="inputTitle">Name *</div>
            <div className="inputWrapper">
              <input
                className={`input ${nameError && "hasError"}`}
                maxLength={60}
                placeholder="Collection Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={validateName}
              />
              <div className="flex_sc">
                {(nameError && <div className="error">{nameError}</div>) || (
                  <span className="hide"></span>
                )}
                <div className="lengthIndicator">{name.length}/60</div>
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">Cover Image *</div>
            <div className="inputSubTitle">
              This image will be used for navigation. 300x300 recommended.
            </div>
            <div className="inputWrapper">
              <div className="uploadBox">
                {Cover ? (
                  <>
                    <img src={Cover} />
                    <div className="removeOverlay">
                      <div className="removeIcon" onClick={removeCover}>
                        <img src={closeIcon.src} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="uploadOverlay"
                    onClick={() => coverRef.current?.click()}
                  >
                    <input
                      ref={coverRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleCoverSelect}
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

          <div className="inputGroup">
            <div className="inputTitle">Profile Image *</div>
            <div className="inputSubTitle">
              This image will also be used for collection detail. 1200x300
              recommended.
            </div>
            <div className="inputWrapper">
              <div className="uploadBox">
                {profile ? (
                  <>
                    <img src={profile} />
                    <div className="removeOverlay">
                      <div className="removeIcon" onClick={removeProfile}>
                        <img src={closeIcon.src} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="uploadOverlay"
                    onClick={() => profileRef.current?.click()}
                  >
                    <input
                      ref={profileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleProfileSelect}
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

          <div className="inputGroup">
            <div className="inputTitle">Description *</div>
            <div className="inputWrapper">
              <textarea
                className={`input longInput ${descriptionError && "hasError"}`}
                maxLength={1000}
                placeholder="Provide your description for your collection"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={validateDescription}
              />
              <div className="flex_sc">
                {(descriptionError && (
                  <div className="error">{descriptionError}</div>
                )) || <span className="hide"></span>}
                <div className="lengthIndicator">{description.length}/1000</div>
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">URL</div>
            <div className="inputSubTitle">
              <p>Customize your URL on MXC loT NFT Marketplace.</p>
              <p>You must have MXC Domains to assign to the URL.</p>
              {/* <p>https://wannsee-nft.mxc.com/collections/domain.mxc</p> */}
              <p>https://nft.mxc.com/collections/domain.mxc</p>
            </div>
            <div className="inputWrapper">
              <select
                value={domainValue}
                onChange={onChangeDomain}
                className={`block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">Select domains</option>
                {domains.map((option: any) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">Category and tags</div>
            <div className="inputSubTitle">
              Make your items more discoverable on Marketplace by adding tags
              and a category.
            </div>
            <div className="inputWrapper">
              <select
                value={categoryValue}
                onChange={onChangeCategory}
                className={`block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">Select a category</option>
                {CategoryArray.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {categoryValue && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: any) => (
                      <div
                        key={tag.id}
                        className="flex items-center px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        <span>{tag.name}</span>
                        <button
                          className="ml-2 text-sm text-white focus:outline-none"
                          onClick={() => handleTagDelete(tag.id)}
                        >
                          &#10005;
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="mt-2 p-2 border border-gray-300 rounded"
                    placeholder="Add Tag and Enter"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                  />
                  <span className="inputSubTitle">(Up to 5 labels)</span>
                </div>
              )}
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">Creator Earnings(%) *</div>
            <div className="inputSubTitle">
              Collection owners can colelct creator earnings when a user
              re-sells an item they created. Contract the collection onwer to
              change the collection earnings percentage or the payout address
            </div>
            <div className="inputWrapper flex_c">
              <input
                disabled={isEdit}
                value={royaltyRecipient}
                type="text"
                className="addressInput w-10/12 mr-5 p-2 border border-gray-300 rounded"
                placeholder="Please input a address"
                onChange={(e: any) => {
                  setRoyaltyRecipient(e.target.value)
                }}
              ></input>
              <PriceInput
                disabled={isEdit}
                className="priceInput w-2/12"
                placeholder="Collection Royalty"
                decimals={2}
                value={"" + royalty}
                onChange={(val: any) =>
                  val[val.length - 1] === "."
                    ? setRoyalty(val)
                    : setRoyalty(Math.min(100, +val))
                }
              />
              %
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">Your site</div>
            <div className="inputWrapper">
              <input
                className={`input`}
                maxLength={60}
                placeholder=""
                value={site}
                onChange={(e) => setSite(e.target.value)}
              />
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">Socials</div>
            <div className="inputWrapper">
              <input
                className={`input`}
                maxLength={60}
                placeholder=""
                value={social}
                onChange={(e) => setSocial(e.target.value)}
              />
            </div>
          </div>

          <div className="subwrap flex_c mt-5">
            {!isEdit ? (
              <Web3Button
                contractAddress={CONTRACTS_MAP.COLLECTION_FACTORY}
                contractAbi={ABI.collectionFactory}
                action={async () => await saveCollection()}
                className="px-4 py-2 bg-blue-600 text-white"
              >
                Save Collection
              </Web3Button>
            ) : (
              <button
                onClick={editCollection}
                disabled={editLoading}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                  editLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {editLoading ? "Wait..." : "Edit Collection"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default CollectDetail
