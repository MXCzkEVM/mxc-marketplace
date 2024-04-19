import type { NextPage } from "next"
import Link from "next/link"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { SupportButton } from "../components/SupportButton"
import { useTranslation } from "react-i18next"

/**
 * Landing page with a simple gradient background and a hero asset.
 * Free to customize as you see fit.
 */
const Home: NextPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.hero}>
            {/* <div className={styles.heroBackground}>
              <div className={styles.heroBackgroundInner}>
                <Image
                  src="/hero-gradient.png"
                  width={1390}
                  height={1390}
                  alt="Background gradient from red to blue"
                  quality={100}
                  className={styles.gradient}
                />
              </div>
            </div> */}
            <div className={styles.heroAssetFrame}>
              <Image
                src="/hero-asset.webp"
                width={860}
                height={540}
                alt="Hero asset, NFT marketplace"
                quality={100}
                className={styles.heroAsset}
              />
            </div>
            <div className={styles.heroBodyContainer}>
              <div className={styles.heroBody}>
                <h1 className={styles.heroTitle}>
                  {/* <span className={styles.heroTitleGradient}></span> */}
                  {t("Connect and Certify")}
                  <br />
                  {t("Real-world Collectables")}
                </h1>
                <p className={styles.heroSubtitle}>
                  <Link
                    className={styles.link}
                    href="https://www.mxc.org/"
                    target="_blank"
                  >
                    MXC zkEVM
                  </Link>{" "}
                  {t("uses LPWAN and NFC technology to track")}
                </p>

                <div className={styles.heroCtaContainer}>
                  <Link className={styles.heroCta} href="/collections">
                    Get Started
                  </Link>
                  <Link
                    className={styles.secondaryCta}
                    href="https://github.com/MXCzkEVM"
                    target="_blank"
                  >
                    GitHub
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <SupportButton /> */}
    </>
  )
}

export default Home
