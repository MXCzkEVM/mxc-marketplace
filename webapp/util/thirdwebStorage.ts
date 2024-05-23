import {
    ThirdwebStorage,
    StorageDownloader,
    IpfsUploader,
} from "@thirdweb-dev/storage"

import { gatewayUrls } from "../const/Network"

const downloader = new StorageDownloader({
  clientId: "0c0e96d3fc507e0144759d37ac320fdc",
  secretKey: 'KJm90goB7ekKKDs1HdnyIYG-n9PY_QYYJm14Lo9EEc-5pZ3KCotoCuIS9WVmhqzwUxUiwPNMIdPhcY8iyBzf-A'
})
const uploader = new IpfsUploader()
const storage = new ThirdwebStorage({ uploader, downloader, gatewayUrls })

export const storageInterface = storage