
import axios from "axios"


export const getJsonFromIPFS = async (ipfsHash: string) => {
    try {
        const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        const jsonData = response.data;
        return jsonData;
    } catch (error) {
        console.error('Error reading JSON from IPFS:', error);
        return ""
    }
}

export const storeImage = async (formData: any) => {
    try {
        const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
                pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
                pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY}`,
                "Content-Type": "multipart/form-data",
            },
        })
        return resFile?.data?.IpfsHash ?? "";
    } catch (error) {
        console.log("storeImages error: ", error)
        return ""
    }
}

export const storeJson = async (data: any) => {
    try {
        const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
            data: data,
            headers: {
                pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
                pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY}`,
                "Content-Type": "application/json",
            },
        })
        return resFile?.data?.IpfsHash ?? "";
    } catch (error) {
        console.log("storeJsons error: ", error)
        return ""
    }
}
