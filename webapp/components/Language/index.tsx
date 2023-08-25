import React from "react"
import { X, Check } from "react-feather"
import { locales } from "@/util/i18nLocal"
import { useTranslation } from "react-i18next"

export default function LanguageModal(props: any) {
  const { i18n, t } = useTranslation()
  const switchLang = async (value: string) => {
    ;(i18n as any).changeLanguage(value)
    props.setLangVisible(false)
  }

  return (
    <div className="language_modal">
      <div className="inner">
        <div className="Modal-header-wrapper">
          <div className="Modal-title-bar">
            <div className="Modal-title">{t("Select Language")}</div>
            <div className="Modal-close-button">
              <X
                className="csp"
                size={20}
                onClick={() => props.setLangVisible(false)}
              />
            </div>
          </div>
        </div>
        <div className="divider"></div>
        <div className="languagebox">
          {Object.keys(locales).map((item) => {
            return (
              <div
                key={item}
                className={`menu-item flexbox`}
                onClick={() => switchLang(item)}
              >
                <div className="menu-item-group text-xs">{locales[item]}</div>
                <div className="network-dropdown-menu-item-img flexbox">
                  {props.currentLanguage === item && <Check size={15} />}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
