import { useRouter } from "next/router"
import React, { useState, useEffect, useRef } from "react"
import Select from "react-select"
import Container from "../../components/Container/Container"

import uploadIcon from "../../assets/imgs/upload.png"
import plusIcon from "../../assets/svgs/plus.svg"
import closeIcon from "../../assets/svgs/close.svg"

export default function AssetCrearePage() {
  const logoRef = useRef<any>(null)

  const [name, setName] = useState("")
  const [nameError, setNameError] = useState<any>(null)
  const [logo, setLogo] = useState(null)
  const [external_link, setExternal] = useState("")
  const [description, setDescription] = useState("")
  const [collection_id, setCollection] = useState("")

  const [isSwitchOn, setSwitch] = useState(false)

  // const [address, setAddress] = useState("")

  // traits
  const [traits, setTraits] = useState<any>([])
  const [editingIndex, setEditingIndex] = useState(null)
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")

  const collections = [
    {
      id: "1",
      label: "cxkjntm",
      img: "https://i.seadn.io/gcs/files/2c5f99a43056d7b4b49e5ba8815739de.jpg?auto=format&dpr=1&w=48",
    },
    {
      id: "2",
      label: "hellw",
      img: "https://i.seadn.io/gcs/files/b1702aae1b4cf0b577ab93c0732ff29e.jpg?auto=format&dpr=1&w=48",
    },
  ]

  // useEffect(() => {
  //   const fetchData = async () => {}
  //   fetchData()
  // }, [])

  useEffect(() => {
    if (isSwitchOn) {
      // 当 switch 打开时执行一些操作
      console.log("Switch is on")
    }
  }, [isSwitchOn])

  const removeLogo = () => {
    setLogo(null)
  }

  const handleAddOrEditTrait = (e: any) => {
    e.preventDefault()
    if (editingIndex !== null) {
      const newTraits: any = [...traits]
      newTraits[editingIndex] = { key, value }
      setTraits(newTraits)
      setEditingIndex(null)
    } else {
      setTraits([...traits, { key, value }])
    }
    setKey("")
    setValue("")
  }

  const handleEditTrait = (index: any): void => {
    setKey(traits[index].key)
    setValue(traits[index].value)
    setEditingIndex(index)
  }

  const handleDeleteTrait = (index: any) => {
    setTraits(traits.filter((_: any, i: any) => i !== index))
  }

  const onChangeCollection = (e: any) => {
    if (e && e.target && e.target.id) {
      setCollection(e.target.id as string)
    } else {
      setCollection("")
    }
  }

  const handleLogoSelect = (e: any) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]

      const reader = new FileReader()
      reader.onload = function (e: any) {
        setLogo(e.target.result)
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

  return (
    <Container maxWidth="lg">
      <div className="create_page">
        <div className="inner">
          <div className="title">Create New Item</div>

          <div className="inputGroup">
            <div className="inputTitle">Name *</div>
            <div className="inputWrapper">
              <input
                className={`input ${nameError && "hasError"}`}
                maxLength={30}
                placeholder="Item Name"
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
            <div className="inputTitle">NFT Image</div>
            <div className="inputSubTitle">
              This image will also be used for navigation. 300x300 recommended.
            </div>
            <div className="inputWrapper">
              <div className="logoUploadBox">
                {logo ? (
                  <>
                    <img src={logo} />
                    <div className="removeOverlay">
                      <div className="removeIcon" onClick={removeLogo}>
                        <img src={closeIcon.src} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div
                    className="uploadOverlay"
                    onClick={() => logoRef.current?.click()}
                  >
                    <input
                      ref={logoRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleLogoSelect}
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
            <div className="inputTitle">External link</div>
            <div className="inputSubTitle">
              MXC loT NFT marketplace will include a link to this URL on this
              item's detail page, so that users can click to learn more about
              it.You are welcome to link to your own webpage with more details.
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
          </div>

          <div className="inputGroup">
            <div className="inputTitle">Description</div>
            <div className="inputSubTitle">
              The description will be inclueded on the item's detail page
              unserneath its image.
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
              This is the collection where your item will appear.
            </div>
            <div className="inputWrapper">
              <Select
                options={collections}
                isClearable
                isSearchable
                defaultInputValue={collection_id}
                placeholder="Select your collection"
                onChange={onChangeCollection}
                formatOptionLabel={({ label, img }: any) => (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={img}
                      alt={label}
                      style={{ marginRight: 10, height: 20, width: 20 }}
                    />
                    <span className="text-zinc-950	">{label}</span>
                  </div>
                )}
              />
            </div>
          </div>

          <div className="inputGroup">
            <div className="inputTitle">Traits *</div>
            <div className="inputSubTitle">
              Textual traits that show up as rectangles
            </div>
            <div className="inputWrapper">
              <div className="p-4 bg-black text-white shadow-md rounded">
                {traits.map(({ key, value }: any, i: any) => (
                  <div key={i} className="flex justify-between mb-2">
                    <p>
                      <span className="font-semibold">{key}</span>: {value}
                    </p>
                    <div>
                      <button
                        className="mr-2 text-yellow-500"
                        onClick={() => handleEditTrait(i)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => handleDeleteTrait(i)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                <form onSubmit={handleAddOrEditTrait}>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Trait Key"
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      className="p-2 bg-gray-800 text-white border rounded w-1/2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Trait Value"
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
              <div className="t">Real-World Collectables</div>
              <div className="flex items-center justify-start">
                <label
                  htmlFor="toggle"
                  className={`relative inline-block w-12 h-6 transition-all duration-200 ease-in-out bg-gray-400 rounded-full shadow-inner cursor-pointer ${
                    isSwitchOn && "bg-green-400"
                  }`}
                >
                  <input
                    id="toggle"
                    type="checkbox"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    checked={isSwitchOn}
                    onChange={() => setSwitch(!isSwitchOn)}
                  />
                  <span
                    className={`absolute left-1 top-1 w-4 h-4 transition-all duration-200 ease-in-out bg-white rounded-full shadow ${
                      isSwitchOn && "transform translate-x-6"
                    }`}
                  />
                </label>
              </div>
            </div>
            <div className="inputSubTitle">
              The location proofs of the loT NFT will be included in the product
              exhibition page for the device
            </div>
          </div>

          <div className="subwrap flex_c mt-5">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white">
              Create
            </button>
          </div>
        </div>
      </div>
    </Container>
  )
}
