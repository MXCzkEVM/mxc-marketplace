import React, { useEffect } from "react"
import { PriceConstants } from "@/const/Local"

export const PriceInputErrors = {
  MAX_INPUT_EXCEEDED: "Max input value exceeded",
}

const PriceInput = ({
  value,
  decimals = 0,
  onChange,
  onInputError = (err) => {
    // console.log(err)
  },
  max = PriceConstants.MAX_PRICE,
  ...rest
}) => {
  useEffect(() => {
    onChange(checkDecimals(value))
  }, [decimals])

  useEffect(() => {
    if (parseInt(value) > parseInt(max)) {
      onInputError(PriceInputErrors.MAX_INPUT_EXCEEDED)
    } else {
      onInputError(null)
    }
  }, [value])

  const checkDecimals = (val) => {
    if (!val) return ""
    if (val.indexOf(".") > -1 && val.length - val.indexOf(".") - 1 > decimals) {
      const ret = Math.floor(+val * 10 ** decimals) / 10 ** decimals
      return ret.toString()
    }
    return val
  }

  const handleChange = (e) => {
    onChange(checkDecimals(e.target.value))
  }

  return (
    <input
      type="number"
      value={value}
      onChange={handleChange}
      {...rest}
    />
  )
}

export default PriceInput
