import React from "react"
import styles from "./Skeleton.module.css"

type Props = {
  width?: string
  height?: string
  borderRadius?: string
}

export default function Skeleton({
  height,
  width,
  borderRadius = "10px",
}: Props) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
      }}
      className={styles.skeleton}
    />
  )
}
