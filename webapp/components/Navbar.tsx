import { ConnectWallet, useAddress } from "@thirdweb-dev/react"
import Image from "next/image"
import Link from "next/link"

import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu"
import "@szhsin/react-menu/dist/index.css"
import "@szhsin/react-menu/dist/transitions/slide.css"
import { AiOutlineMenu } from "react-icons/ai"
import { HiLanguage } from "react-icons/hi2"
import { useTranslation } from "react-i18next"
import CartButton from "./CartButton"
import IconWallet from "./IconWallet"

/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar(props: any) {
  const address = useAddress()
  const { t } = useTranslation()

  return (
    <div className="navContainer">
      <nav className="nav">
        <div className="pc hidden sm:block">
          <div className="navLeft">
            <Link href="/" className={`homeLink navLeft`}>
              <span className="spacex">MOONCHAIN</span>
            </Link>

            <div className="navMiddle">
              <Link href="/rwa" className="link">
                {t("RWA")}
              </Link>
              <Link href="/launchpad" className="link">
                {t("Launchpad")}
              </Link>
              <Link href="/collections" className="link">
                {t("Collections")}
              </Link>
              <Link href="/hexagons" className="link">
                {t("Hexagon")}
              </Link>
              <Link href="/domains" className="link">
                {t("Domains")}
              </Link>
              <Link href="/miners" className="link">
                {t("Miners")}
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
            <MenuItem href="/rwa">{t("RWA")}</MenuItem>
            <MenuItem href="/launchpad">{t("Launchpad")}</MenuItem>
            <MenuItem href="/collections">{t("Collections")}</MenuItem>
            <MenuItem href="/hexagons">{t("Hexagon")}</MenuItem>
            <MenuItem href="/domains">{t("Domains")}</MenuItem>
            <MenuItem href="/miners">{t("Miners")}</MenuItem>
          </Menu>
        </div>

        <div className={"navRight"}>
          <div className={"navConnect"}>
            <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
          </div>
          {address && (<>
            <a href={`/profile/${address}`}>
              <IconWallet className="text-[42px]" />
            </a>
            <CartButton />
          </>)}
          <div className="text-gradient more csp" onClick={() => props.setLangVisible(true)}>
            <HiLanguage size="22px" />
          </div>
        </div>
      </nav>
    </div>
  )
}
