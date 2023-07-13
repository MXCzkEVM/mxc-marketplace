import {
    ThirdwebStorage,
    StorageDownloader,
    IpfsUploader,
} from "@thirdweb-dev/storage"

import { gatewayUrls } from "../const/Network"

const downloader = new StorageDownloader()
const uploader = new IpfsUploader()
const storage = new ThirdwebStorage({ uploader, downloader, gatewayUrls })

export const storageInterface = storage