import { ConnectWallet, useAddress } from "@thirdweb-dev/react"
import Image from "next/image"
import Link from "next/link"
// import styles from "./Navbar.module.css"

import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu"
import "@szhsin/react-menu/dist/index.css"
import "@szhsin/react-menu/dist/transitions/slide.css"
import { AiOutlineMenu } from "react-icons/ai"

/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  const address = useAddress()

  return (
    <div className="navContainer">
      <nav className="nav">
        <div className="pc hidden sm:block">
          <div className="navLeft">
            <Link href="/" className={`homeLink navLeft`}>
              <Image
                src="/mxc-logo.svg"
                width={96}
                height={48}
                alt="NFT marketplace sample logo"
              />
            </Link>

            <div className="navMiddle">
              <Link href="/collections" className="link">
                Collections
              </Link>
              <Link href="/hexagons" className="link">
                Hexagon
              </Link>
              <Link href="/domains" className="link">
                Domains
              </Link>
            </div>
          </div>
        </div>

        <div className="mobile block sm:hidden">
          <Menu
            menuButton={
              <MenuButton>
                <AiOutlineMenu size="25px" />
              </MenuButton>
            }
          >
            <MenuItem href="/collections">Collections</MenuItem>
            {/* <MenuItem href="/hexagons">Hexagon</MenuItem>
            <MenuItem href="/domains">Domains</MenuItem> */}
          </Menu>
        </div>

        <div className={"navRight"}>
          <div className={"navConnect"}>
            <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
          </div>
          {address && (
            <Link className={"link"} href={`/profile`}>
              <Image
                className={"profileImage"}
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
