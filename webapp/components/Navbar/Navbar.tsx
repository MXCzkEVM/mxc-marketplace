import { ConnectWallet, useAddress } from "@thirdweb-dev/react"
import Image from "next/image"
import Link from "next/link"
import styles from "./Navbar.module.css"
/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  const address = useAddress()

  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link href="/" className={`${styles.homeLink} ${styles.navLeft}`}>
            <Image
              src="/mxc-logo.svg"
              width={96}
              height={48}
              alt="NFT marketplace sample logo"
            />
          </Link>

          <div className={styles.navMiddle}>
            <Link href="/collections" className={styles.link}>
              Collections
            </Link>
            <Link href="/hexagons" className={styles.link}>
              Hexagon
            </Link>
            <Link href="/domains" className={styles.link}>
              Domains
            </Link>
            {/* <Link href="/buy" className={styles.link}>
              Buy
            </Link>
            <Link href="/sell" className={styles.link}>
              Sell
            </Link> */}
          </div>
        </div>

        <div className={styles.navRight}>
          <div className={styles.navConnect}>
            <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
          </div>
          {address && (
            <Link className={styles.link} href={`/profile`}>
              <Image
                className={styles.profileImage}
                src="/user-icon.png"
                width={42}
                height={42}
                alt="Profile"
              />
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}
