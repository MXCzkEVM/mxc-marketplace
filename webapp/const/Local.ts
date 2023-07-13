

export const version = "v100002"
export const zeroAddress = '0x0000000000000000000000000000000000000000'
export const IPFS_GATEWAY = 'https://aqua-adverse-coyote-886.mypinata.cloud/ipfs/'
export const CategoryArray = [
    {
        label: "Winery",
        value: 1,
    },
    {
        label: "Gemstone",
        value: 2,
    },
    {
        label: "Fashion",
        value: 3,
    },
    {
        label: "Sports",
        value: 4,
    },
    {
        label: "Watch",
        value: 5,
    },
    {
        label: "Cars",
        value: 6,
    },
]
export const CategoryMap = CategoryArray.reduce((map: any, item) => {
    map[item.value] = item.label;
    return map;
}, {});

export const PriceConstants = {
    UPDATE_PRICE: "UPDATE_PRICE",
    MAX_PRICE: "999999999",
}