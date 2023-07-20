const axios = require("axios")

const storeJson = async (data) => {
    try {
        const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            data: data,
            headers: {
                pinata_api_key: `${process.env.PINATA_API_KEY}`,
                pinata_secret_api_key: `${process.env.PINATA_SECRET_API_KEY}`,
                "Content-Type": "application/json",
            },
        })
        return resFile?.data?.IpfsHash ?? ""
    } catch (error) {
        console.log("storeJsons error: ", error)
        return ""
    }
}

module.exports = {
    storeJson,
}
