import Router from "next/router"
import React, { useState, useEffect, useRef } from "react"
import {
  Web3Button,
  useAddress,
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react"
import { toast } from "react-toastify"
// import { ChainId, ThirdwebSDK } from "@thirdweb-dev/sdk"
import { storeImage } from "@/util/uploadToPinata"
// import { NETWORK } from "@/const/Network"
import FormData from "form-data"
import axios from "axios"

import { ethers } from "ethers"
import Container from "@/components/Container/Container"
import PriceInput from "@/components/PriceInput"
import uploadIcon from "@/assets/imgs/upload.png"
import plusIcon from "@/assets/svgs/plus.svg"
import closeIcon from "@/assets/svgs/close.svg"
import ApiClient from "@/util/request"
import mnsClient from "@/util/apolloClient"
import { getMnsDomainWithAddress } from "@/graphql/mns"
import { useTranslation } from "react-i18next"

const api = new ApiClient("/")

import { CHAIN_ID } from "@/const/Network"
import { CONTRACTS_MAP, ABI, instanceCollectionFactory } from "@/const/Address"
import {
  CategoryArray,
  zeroAddress,
  version,
  IPFS_GATEWAY,
} from "@/const/Local"

const CollectDetail = (props: any) => {

  const coverRef = useRef<any>(null)
  const profileRef = useRef<any>(null)
  const nftFileRef = useRef<any>(null)

  const [name, setName] = useState("")
  const [nftName, setNftName] = useState("")
  const [nftDescription, setNftDescription] = useState("")
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
    {
      trait_type: "Location Proofs",
      value: "MEP-1002",
    },
    {
      trait_type: "Source",
      value: "MXC Community Design",
    },
  ])
  const address = useAddress()

  const [nftNameError, setNftNameError] = useState<any>(null)
  const [nameError, setNameError] = useState<any>(null)
  const [cover, setCover] = useState<any>(null)
  const [coverFile, setCoverFile] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [profileImage, setprofileImage] = useState<any>(null)
  const [nftFile, setNftFile] = useState<any>(null)
  const [nftFileImage, setNftFileImage] = useState<any>(null)
  const [description, setDescription] = useState("")
  const [descriptionError, setDescriptionError] = useState<any>(null)
  const [domainValue, setDomainValue] = useState<any>()
  const [categoryValue, setCategory] = useState<any>()
  const [site, setSite] = useState("")
  const [social, setSocial] = useState("")
  const [tags, setTags] = useState<any>([])
  const [inputValue, setInputValue] = useState("")
  const [royalty, setRoyalty] = useState<any>("")
  const royaltyRecipient = address

  const [trait_type, setTraitType] = useState("")
  const [value, setValue] = useState("")
  const [editingIndex, setEditingIndex] = useState(null)

  // "Techcode.MXC", "HelloWorld.MXC"
  // const domains: any = []
  const nftUri = process.env.NEXT_PUBLIC_NFTURL

  const { contract } = useContract(
    CONTRACTS_MAP.COLLECTION_FACTORY,
    ABI.collectionFactory
  )
  const { mutateAsync: createCollection } = useContractWrite(
    contract,
    "createCollection"
  )

  const { t } = useTranslation()



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
  const removeNftFile = () => {
    setProfile(null)
    setprofileImage(null)
  }

  const handleEditTrait = (index: any): void => {
    setTraitType(traits[index].trait_type)
    setValue(traits[index].value)
    setEditingIndex(index)
  }

  const handleDeleteTrait = (index: any) => {
    setTraits(traits.filter((_: any, i: any) => i !== index))
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
  const handleNftFileSelect = (e: any) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]

      setNftFileImage(file)

      const reader = new FileReader()
      reader.onload = function (e: any) {
        setNftFile(e.target.result)
      }

      reader.readAsDataURL(file)
    }
  }

  const validateName = () => {
    if (name.length === 0) {
      setNameError(t("This field is required"))
    } else {
      setNameError(null)
    }
  }

  const validateDescription = () => {
    if (description.length === 0) {
      setDescriptionError(t("This field is required"))
    } else {
      setDescriptionError(null)
    }
  }
  const validateNftName = () => {
    if (name.length === 0) {
      setNameError(t("This field is required"))
    } else {
      setNameError(null)
    }
  }

  const validateNftDescription = () => {
    if (description.length === 0) {
      setDescriptionError(t("This field is required"))
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

  const handleTagDelete = (tagId: any) => {
    const updatedTags = tags.filter((tag: any) => tag.id !== tagId)
    setTags(updatedTags)
  }

  async function checkDomain() {
    if (domainValue) {
      const { data } = await axios.post("/api/check-domain", {
        chainId: CHAIN_ID,
        domain: domainValue
      })
      if (data.code !== 200) {
        toast.error(t('The domain name is already in use'))
        return false
      }
    }

    return true
  }

  async function pinataStoreImage(file: File) {
    const formData = new FormData()
    const metadata = JSON.stringify({
      name: `${version}_${file.name}`,
    })
    formData.append("pinataMetadata", metadata)
    formData.append("file", file)
    return await storeImage(formData)
  }
  async function saveCollection() {
    if (!name) {
      toast.warn(t("Please type your collection name"))
      return
    }
    if (!description) {
      toast.warn(t("Please type your collection description"))
      return
    }
    if (!royaltyRecipient) {
      toast.warn(t("Please type your collection royalty recipient"))
      return
    }
    if (!ethers.utils.isAddress(royaltyRecipient)) {
      toast.warn(t("Please type a correct address"))
      return
    }

    // if want to bind domain, need to signature
    let signedMessage: string = ""

    let cover_ipfs: any = ""
    let profile_ipfs: any = ""
    let nft_ipfs: any = ""
    if (coverFile)
      cover_ipfs = await pinataStoreImage(coverFile)
    if (profileImage)
      profile_ipfs = await pinataStoreImage(profileImage)
    if (nftFileImage)
      nft_ipfs = await pinataStoreImage(nftFileImage)

    if (!cover_ipfs) {
      toast.warn(t("Please upload a cover image"))
      return
    }
    if (!profile_ipfs) {
      toast.warn(t("Please upload a profile image"))
      return
    }
    if (!nft_ipfs) {
      toast.warn(t("Please upload a nft image"))
      return
    }

    let formData: any = {
      cover: cover_ipfs,
      profile: profile_ipfs,
      nft: nft_ipfs,
      nftName,
      nftDescription,
      name,
      description,
      royaltyRecipient,
      royaltiesCutPerMillion: royalty * 100,
      url: domainValue || "",
      category: categoryValue,
      traits,
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

            let res = await axios.post("/api/create-collection-launchpad", {
              formData,
              signedMessage,
            })
            if (res.data.status !== 200) {
              toast.error(t("API call failed"))
              return
            }

            toast.success(t("NFT Collection create successfully"))
            Router.push(`/profile/${address}`)
          }
        }
      )

      if (!(await checkDomain()))
        return

      // Simple one-liner for buying the NFT
      txResult = await createCollection({
        args: [
          formData.name,
          formData.name,
          formData.royaltiesCutPerMillion,
          formData.royaltyRecipient,
          CONTRACTS_MAP['XSD']
        ],
      })
    } catch (error) {
      // console.error(error)
      console.log(error)
      toast.error(t(`NFT Collection create failed`))
    }

    return txResult
  }

  return (
    <Container maxWidth="lg">
      <div className="create_page">
        <div className="inner">
          <div className="inputGroup">
            <div className="inputTitle">{t("Colllection Name")} *</div>
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
            <div className="inputTitle">Description *</div>
            <div className="inputWrapper">
              <textarea
                className={`input longInput ${descriptionError && "hasError"}`}
                maxLength={1000}
                placeholder={t("Provide your description for your collection")}
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
            <div className="inputTitle">{t("Cover Image")} *</div>
            <div className="inputSubTitle">
              {t("This image will be used for navigation")}
            </div>
            <div className="inputWrapper">
              <div className="uploadBox">
                {cover ? (
                  <>
                    <img src={cover} />
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
              {t("This image will also be used for collection detail")}
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

          <br style={{ height: 20 }} />

          <div className="inputGroup">
            <div className="inputTitle">{t("NFT Name")} *</div>
            <div className="inputWrapper">
              <input
                className={`input ${nftNameError && "hasError"}`}
                maxLength={30}
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                onBlur={validateNftName}
              />
              <div className="flex_sc">
                {(nftNameError && <div className="error">{nftNameError}</div>) || (
                  <span className="hide"></span>
                )}
                <div className="lengthIndicator">{name.length}/30</div>
              </div>
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">{t("NFT Description")}</div>
            <div className="inputSubTitle">
              {t("The description will be inclueded on the item")}
            </div>
            <div className="inputWrapper">
              <textarea
                className={`input longInput`}
                maxLength={1000}
                placeholder=""
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">NFT Image *</div>
            <div className="inputSubTitle">
              {/* {t("This image will also be used for collection detail")} */}
            </div>
            <div className="inputWrapper">
              <div className="uploadBox">
                {nftFile ? (
                  <>
                    <img src={nftFile} />
                    <div className="removeOverlay">
                      <div className="removeIcon" onClick={removeNftFile}>
                        <img src={closeIcon.src} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="uploadOverlay"
                    onClick={() => nftFileRef.current?.click()}
                  >
                    <input
                      ref={nftFileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleNftFileSelect}
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
            <div className="inputTitle">URL</div>
            <div className="inputSubTitle">
              <p>{t("Customize your URL on MXC loT NFT Marketplace")}</p>
              <p>{t("You must have MXC Domains to assign to the URL")}</p>
              <p>{`${nftUri}/collections/domain.mxc`}</p>
            </div>
            <div className="inputWrapper">
              <select
                value={domainValue}
                onChange={onChangeDomain}
                className={`block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">{t("Select domains")}</option>
                {domains.map((option: any) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div> */}

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
            <div className="inputTitle">{t("Category and tags")}</div>
            <div className="inputSubTitle">
              {t(
                "Make your items more discoverable on Marketplace by adding tags and a category"
              )}
            </div>
            <div className="inputWrapper">
              <select
                value={categoryValue}
                onChange={onChangeCategory}
                className={`block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              >
                <option value="">{t("Select a category")}</option>
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
            <div className="inputTitle">{t("Your site")}</div>
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
            <div className="inputTitle">{t("Socials")}</div>
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
            <Web3Button
              contractAddress={CONTRACTS_MAP.COLLECTION_FACTORY}
              contractAbi={ABI.collectionFactory}
              action={async () => await saveCollection()}
              className="px-4 py-2 bg-blue-600 text-white"
            >
              Save Launchpad Collection
            </Web3Button>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default CollectDetail
