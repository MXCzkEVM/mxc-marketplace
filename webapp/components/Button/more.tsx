import { FaArrowDown, FaSpinner } from "react-icons/fa"
import { useTranslation } from "react-i18next"

function MoreButton(props: any) {
  const { t } = useTranslation()
  return (
    <div className="loadmore flex_c mt-3">
      <button
        disabled={props.loadmore}
        onClick={props.loadMoreData}
        className="text-white font-bold px-4 flex items-center space-x-2"
      >
        {props.loadmore ? (
          <>
            <FaSpinner className="animate-spin" /> <span>Loading...</span>
          </>
        ) : (
          <>
            <span>{t("More")}</span>
            <FaArrowDown size={12} />
          </>
        )}
      </button>
    </div>
  )
}

export default MoreButton
