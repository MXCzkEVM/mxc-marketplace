import React from "react"
import styles from "./Skeleton.module.css"

type Props = {
  width?: string
  height?: string
  borderRadius?: string
}

export default function SkeletonList({ borderRadius = "10px" }: Props) {
  return (
    <>
      <div style={{borderRadius}}className={`${styles.SkeletonList}`} />
    </>
  )
}
