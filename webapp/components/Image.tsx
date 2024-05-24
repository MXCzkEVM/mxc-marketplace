import React, { useState } from "react"

const ImageWithDefault = ({ src, defaultImage, alt, ...props }: any) => {
  const [imageSrc, setImageSrc] = useState(defaultImage)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageSrc(src)
  }

  return (
    <img
      src={imageLoaded ? imageSrc : defaultImage}
      alt={alt}
      onLoad={handleImageLoad}
      {...props}
      style={{objectFit: 'cover', ...props.style}}
    />
  )
}

export default ImageWithDefault
