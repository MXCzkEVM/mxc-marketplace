import axios from "axios";
const API_URL = "https://opensea-server.onrender.com";

class CollectionService {
    NameData() {
        return [
            {
                "_id": "643fa22d7429162e185192ae",
                "coverPhoto": "/media/NFTdata/6/2.avif",
                "profilePicture": "/media/NFTdata/6/1.avif",
                // "title": "CLONE X - X TAKASHI",
                "title": "Techcode.MXC",
                "owner": "RTFKTCLONEXTM",
                "earnings": 5,
                "chain": "Ethereum",
                "category": "PFPs",
                "description": "🧬 CLONE X 🧬20,000 next-gen Avatars, by RTFKT and Takashi Murakami 🌸",
                "nftOwner": 9633,
                "uniqNFTOwner": 49,
                "childItems": [
                    "643fe13b65be49bdfdf22ed0",
                    "643fe15e852f613e665dfd56",
                    "643fe17846c868b0e24a404d",
                    "643fe1975f88ebdd11ae50ee",
                    "643fe1b43706d81279410245",
                    "643fe1d505fe0a0b349cd4e7"
                ],
                "createDate": "2023-04-19T08:11:25.972Z",
                "__v": 0
            },
            {
                "_id": "643fa2817966e05b24deb492",
                "coverPhoto": "/media/NFTdata/7/2.avif",
                "profilePicture": "/media/NFTdata/7/1.avif",
                // "title": "Azuki",
                "title": "BlackMount.MXC",
                "owner": "TeamAzuki",
                "earnings": 5,
                "chain": "Ethereum",
                "category": "PFPs",
                "description": "Take the red bean to join the garden. View the collection at azuki.com/gallery.Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future. Azuki holders receive access to exclusive drops, experiences, and more. Visit azuki.com for more details.We rise together. We build together. We grow together.",
                "nftOwner": 4773,
                "uniqNFTOwner": 48,
                "childItems": [
                    "643fe27133bd37a0a4075635",
                    "643fe28edf6c8703bd13adb5",
                    "643fe2c0003718fc2347655a",
                    "643fe2ec81deeb3daabb71f4",
                    "643fe3165a079cd99fe3e10c",
                    "643fe3bab0eb79c4c66ee417"
                ],
                "createDate": "2023-04-19T08:12:49.028Z",
                "__v": 0
            },
            {
                "_id": "643fa2d5f90246b7f7b7122a",
                "coverPhoto": "/media/NFTdata/8/2.avif",
                "profilePicture": "/media/NFTdata/8/1.avif",
                // "title": "Bored Ape Yacht Club",
                "title": "HelloWorld.MXC",
                "owner": "NullAddress",
                "earnings": 2.5,
                "chain": "Ethereum",
                "category": "PFPs",
                "description": "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
                "nftOwner": 5684,
                "uniqNFTOwner": 57,
                "childItems": [
                    "643fe41353d3055172c23d37",
                    "643fe43b2549401e1d3f4300",
                    "643fe4520703656a2c40c600",
                    "643fe470c4471f965eb30556",
                    "643fe48a732b9f72ae626a04",
                    "643fe49e51cb420464ddccac"
                ],
                "createDate": "2023-04-19T08:14:13.693Z",
                "__v": 0
            },
            {
                "_id": "643fa349d34a1015c16e901d",
                "coverPhoto": "/media/NFTdata/9/2.avif",
                "profilePicture": "/media/NFTdata/9/1.avif",
                // "title": "Bored Ape Kennel Club",
                "title": "Chris.MXC",
                "owner": "YugaLabs",
                "earnings": 2.5,
                "chain": "Ethereum",
                "category": "PFPs",
                "description": "It gets lonely in the swamp sometimes. That's why every ape should have a four-legged companion. To curl up at your feet. To bring you a beer. To fire a missile launcher at that bastard Jimmy the Monkey.That's why we've started the Bored Ape Kennel Club, and why we're offering up a dog NFT for adoption to every single member of the BAYC – for free (you only pay gas).Learn more at: http://boredapeyachtclub.com/#/kennel-club",
                "nftOwner": 5432,
                "uniqNFTOwner": 57,
                "childItems": [
                    "643fe500059ae867fcf4d3c1",
                    "643fe51f787512f60c7968dc",
                    "643fe53c53e621f5d56555b0",
                    "643fe558e72d891bd637edba",
                    "643fe66a39b96f6cf2b6cda6",
                    "643fe6957f72af32e18c3de6"
                ],
                "createDate": "2023-04-19T08:16:09.791Z",
                "__v": 0
            },
            // {
            //     "_id": "643fa3e704f0db7d7e2305a7",
            //     "coverPhoto": "/media/NFTdata/10/2.avif",
            //     "profilePicture": "/media/NFTdata/10/1.avif",
            //     "title": "MechMindsAI",
            //     "owner": "MechMinds",
            //     "earnings": 5,
            //     "chain": "Ethereum",
            //     "category": "Art",
            //     "description": "MechMinds is the first delationary project to combine AI x Blockchain with OpenAI's GPT. Currently leveraging GPT3. GPT4 integration coming soon.Our AI Chatbot lets you talk with your NFT. Merge MechMinds to make them smarter & creates a new generative AI NFT. The supply deflates as MechMinds are merged.Current Supply <8192 MechMind robots.",
            //     "nftOwner": 1323,
            //     "uniqNFTOwner": 22,
            //     "childItems": [
            //         "643fe792d93421d7d6f0f6c5",
            //         "643fe7adc078af15e1089ce5",
            //         "643fe7db02e188102120ffd1",
            //         "643fe81bdffaa6c7237d44f7",
            //         "643fe8372292d6ff5dacdf51",
            //         "643fe8534824888eab719ce0"
            //     ],
            //     "createDate": "2023-04-19T08:18:47.349Z",
            //     "__v": 0
            // }
        ]
    }

    HexData() {
        return [
            {
                "_id": "643fa22d7429162e185192ae",
                "coverPhoto": "/media/NFTdata/6/2.avif",
                "profilePicture": "/media/NFTdata/6/1.avif",
                // "title": "CLONE X - X TAKASHI",
                "title": "#fffffff",
                "owner": "RTFKTCLONEXTM",
                "earnings": 5,
                "chain": "Ethereum",
                "category": "PFPs",
                "description": "🧬 CLONE X 🧬20,000 next-gen Avatars, by RTFKT and Takashi Murakami 🌸",
                "nftOwner": 9633,
                "uniqNFTOwner": 49,
                "childItems": [
                    "643fe13b65be49bdfdf22ed0",
                    "643fe15e852f613e665dfd56",
                    "643fe17846c868b0e24a404d",
                    "643fe1975f88ebdd11ae50ee",
                    "643fe1b43706d81279410245",
                    "643fe1d505fe0a0b349cd4e7"
                ],
                "createDate": "2023-04-19T08:11:25.972Z",
                "__v": 0
            },
            {
                "_id": "643fa2817966e05b24deb492",
                "coverPhoto": "/media/NFTdata/7/2.avif",
                "profilePicture": "/media/NFTdata/7/1.avif",
                // "title": "Azuki",
                "title": "ffffff1",
                "owner": "TeamAzuki",
                "earnings": 5,
                "chain": "Ethereum",
                "category": "PFPs",
                "description": "Take the red bean to join the garden. View the collection at azuki.com/gallery.Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future. Azuki holders receive access to exclusive drops, experiences, and more. Visit azuki.com for more details.We rise together. We build together. We grow together.",
                "nftOwner": 4773,
                "uniqNFTOwner": 48,
                "childItems": [
                    "643fe27133bd37a0a4075635",
                    "643fe28edf6c8703bd13adb5",
                    "643fe2c0003718fc2347655a",
                    "643fe2ec81deeb3daabb71f4",
                    "643fe3165a079cd99fe3e10c",
                    "643fe3bab0eb79c4c66ee417"
                ],
                "createDate": "2023-04-19T08:12:49.028Z",
                "__v": 0
            },
            {
                "_id": "643fa2d5f90246b7f7b7122a",
                "coverPhoto": "/media/NFTdata/8/2.avif",
                "profilePicture": "/media/NFTdata/8/1.avif",
                // "title": "Bored Ape Yacht Club",
                "title": "ffffff2",
                "owner": "NullAddress",
                "earnings": 2.5,
                "chain": "Ethereum",
                "category": "PFPs",
                "description": "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
                "nftOwner": 5684,
                "uniqNFTOwner": 57,
                "childItems": [
                    "643fe41353d3055172c23d37",
                    "643fe43b2549401e1d3f4300",
                    "643fe4520703656a2c40c600",
                    "643fe470c4471f965eb30556",
                    "643fe48a732b9f72ae626a04",
                    "643fe49e51cb420464ddccac"
                ],
                "createDate": "2023-04-19T08:14:13.693Z",
                "__v": 0
            },
            {
                "_id": "643fa349d34a1015c16e901d",
                "coverPhoto": "/media/NFTdata/9/2.avif",
                "profilePicture": "/media/NFTdata/9/1.avif",
                // "title": "Bored Ape Kennel Club",
                "title": "ffffff3",
                "owner": "YugaLabs",
                "earnings": 2.5,
                "chain": "Ethereum",
                "category": "PFPs",
                "description": "It gets lonely in the swamp sometimes. That's why every ape should have a four-legged companion. To curl up at your feet. To bring you a beer. To fire a missile launcher at that bastard Jimmy the Monkey.That's why we've started the Bored Ape Kennel Club, and why we're offering up a dog NFT for adoption to every single member of the BAYC – for free (you only pay gas).Learn more at: http://boredapeyachtclub.com/#/kennel-club",
                "nftOwner": 5432,
                "uniqNFTOwner": 57,
                "childItems": [
                    "643fe500059ae867fcf4d3c1",
                    "643fe51f787512f60c7968dc",
                    "643fe53c53e621f5d56555b0",
                    "643fe558e72d891bd637edba",
                    "643fe66a39b96f6cf2b6cda6",
                    "643fe6957f72af32e18c3de6"
                ],
                "createDate": "2023-04-19T08:16:09.791Z",
                "__v": 0
            },
        ]
    }

    NftData() {
        // const nftdata = axios.get(API_URL + "/");
        // return nftdata.then((response) => {
        //     console.log(response.data, 2)
        //     return response.data && response.data.length > 0 ? response.data : []
        // });


        return [
            {
                "_id": "643f9fd3be501ad22098f3e4",
                // "coverPhoto": "/media/NFTdata/1/2.avif",
                "coverPhoto": "https://i.seadn.io/gcs/files/d2625a77b485bad7b6fffcd65af3c461.png?auto=format&dpr=1&h=500&fr=1",
                "profilePicture": "/media/NFTdata/1/1.avif",
                // "title": "Nakamigos",
                "title": "Gin 1689 Limited Edition",
                "owner": "Nakamigos-Deployer",
                "earnings": 5,
                "chain": "Ethereum",
                "category": "Virtual Worlds",
                "description": "20,000 unique crypto investors on the blockchain with commercial rights. Twitter: @Nakamigos.",
                "nftOwner": 5761,
                "uniqNFTOwner": 29,
                "childItems": [
                    "643fd592ffd3b3d22e2bcac4",
                    "643fd5bda3f6380e47bb8883",
                    "643fd5f07a4d3e84ccf8c783",
                    "643fd6886339b8146285210e",
                    "643fd6ba6af0347a3de7eec4",
                    "643fd6f05800b17e3ec07cb1"
                ],
                "createDate": "2023-04-19T08:01:23.381Z",
                "__v": 0
            },
            {
                "_id": "643fa03c0e9745444fb93c58",
                // "coverPhoto": "/media/NFTdata/2/2.avif",
                "coverPhoto": "https://i.seadn.io/gae/5c-HcdLMinTg3LvEwXYZYC-u5nN22Pn5ivTPYA4pVEsWJHU1rCobhUlHSFjZgCHPGSmcGMQGCrDCQU8BfSfygmL7Uol9MRQZt6-gqA?auto=format&dpr=1&h=500&fr=1 1x, https://i.seadn.io/gae/5c-HcdLMinTg3LvEwXYZYC-u5nN22Pn5ivTPYA4pVEsWJHU1rCobhUlHSFjZgCHPGSmcGMQGCrDCQU8BfSfygmL7Uol9MRQZt6-gqA?auto=format&dpr=1&h=500&fr=1 2x",
                "profilePicture": "/media/NFTdata/2/1.avif",
                // "title": "Wrapped Cryptopunks",
                "title": "Tiffany Pendant Cryptopunks",
                "owner": "0ZU",
                "earnings": 0,
                "chain": "Ethereum",
                "category": "PFPs",
                "description": "Wrapped Punks are ERC721 Tokens, each one backed 1:1 by an original Cryptopunk by Larvalabs.Buy an original Cryptopunk at https://larvalabs.com/cryptopunksTurn your Original Cryptopunk into an ERC721 at https://wrappedpunks.com/CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard.",
                "nftOwner": 141,
                "uniqNFTOwner": 18,
                "childItems": [
                    "643fd9477477c06e0d41f22e",
                    "643fd96f2423142aaf7d5299",
                    "643fd98b2445d9954035c902",
                    "643fd9aed922d0ae172cbd53",
                    "643fd9e80f7c49896ab197cb",
                    "643fda13e1d2a717b5415fd7"
                ],
                "createDate": "2023-04-19T08:03:08.496Z",
                "__v": 0
            },
            {
                "_id": "643fa0d1366899148fee5c96",
                // "coverPhoto": "/media/NFTdata/3/2.avif",
                "coverPhoto": "https://i.seadn.io/gae/O0XkiR_Z2--OPa_RA6FhXrR16yBOgIJqSLdHTGA0-LAhyzjSYcb3WEPaCYZHeh19JIUEAUazofVKXcY2qOylWCdoeBN6IfGZLJ3I4A?auto=format&dpr=1&h=500&fr=1 1x, https://i.seadn.io/gae/O0XkiR_Z2--OPa_RA6FhXrR16yBOgIJqSLdHTGA0-LAhyzjSYcb3WEPaCYZHeh19JIUEAUazofVKXcY2qOylWCdoeBN6IfGZLJ3I4A?auto=format&dpr=1&h=500&fr=1 2x",
                "profilePicture": "/media/NFTdata/3/1.avif",
                // "title": "Mutant Ape Yacht Club",
                "title": "MXC Kicks",
                "owner": "YugaLabs",
                "earnings": 2.5,
                "chain": "Ethereum",
                "category": "PFPs",
                "description": "The MUTANT APE YACHT CLUB is a collection of up to 20,000 Mutant Apes that can only be created by exposing an existing Bored Ape to a vial of MUTANT SERUM or by minting a Mutant Ape in the public sale.",
                "nftOwner": 11177,
                "uniqNFTOwner": 57,
                "childItems": [
                    "643fdaac72b117cdfc4262c4",
                    "643fdac9ccf867f7ed13346f",
                    "643fdaea936182c894f45422",
                    "643fdb0d4d9da102780b9f30",
                    "643fdb2e19d23b699c3731b0",
                    "643fdbaca43a4c6702972df9"
                ],
                "createDate": "2023-04-19T08:05:37.850Z",
                "__v": 0
            },
            {
                "_id": "643fa155b078d7f57bafc971",
                // "coverPhoto": "/media/NFTdata/4/2.avif",
                "coverPhoto": "https://i.seadn.io/gcs/files/a426ef374963cb93fe7362d816ed7574.gif?auto=format&dpr=1&h=500&fr=1 1x, https://i.seadn.io/gcs/files/a426ef374963cb93fe7362d816ed7574.gif?auto=format&dpr=1&h=500&fr=1 2x",
                "profilePicture": "/media/NFTdata/4/1.avif",
                // "title": "Otherdeed for Otherside",
                "title": "frac.io Diamond in Custody",
                "owner": "OthersideMeta",
                "earnings": 5,
                "chain": "Ethereum",
                "category": "Virtual Worlds",
                "description": "Otherdeed is the key to claiming land in Otherside. Each have a unique blend of environment and sediment — some with resources, some home to powerful artifacts. And on a very few, a Koda roams.",
                "nftOwner": 19743,
                "uniqNFTOwner": 32,
                "childItems": [
                    "643fdbff2ceef3450bc63a8a",
                    "643fdc27c694a685a6326954",
                    "643fdc50c91bc1226b9ea50e",
                    "643fdc76544011a283993a84",
                    "643fdc9b0b508fef40b002d7",
                    "643fdcb648562a88bb99dab9"
                ],
                "createDate": "2023-04-19T08:07:49.636Z",
                "__v": 0
            },
            {
                "_id": "643fa1b655cbb5a9e0803528",
                // "coverPhoto": "/media/NFTdata/5/2.avif",
                "coverPhoto": "https://i.seadn.io/gcs/files/de4137460a0257cb49c30735aae0bc1c.gif?auto=format&dpr=1&h=500&fr=1 1x, https://i.seadn.io/gcs/files/de4137460a0257cb49c30735aae0bc1c.gif?auto=format&dpr=1&h=500&fr=1 2x",
                "profilePicture": "/media/NFTdata/5/1.avif",
                // "title": "Doodles",
                "title": "Unicask Springbank 1991 Scotch whiskey",
                "owner": "Doodles_LLC",
                "earnings": 5,
                "chain": "Ethereum",
                "category": "PFPs",
                "description": "A community-driven collectibles project featuring art by Burnt Toast. Doodles come in a joyful range of colors, traits and sizes with a collection size of 10,000. Each Doodle allows its owner to vote for experiences and activations paid for by the Doodles Community Treasury.",
                "nftOwner": 5439,
                "uniqNFTOwner": 54,
                "childItems": [
                    "643fdd52bd7fc76e51ef98dd",
                    "643fdd784f77cdcaa3f503cd",
                    "643fdd991460fb1fcfa71fe6",
                    "643fddb6409d295756259e35",
                    "643fddd27754cb9d1032f2fa",
                    "643fe0d83c123d142e19b386"
                ],
                "createDate": "2023-04-19T08:09:26.191Z",
                "__v": 0
            },

        ]
    }

    CollectionData(id: any) {
        // const collectiondata = axios.get(API_URL + "/collection/" + id);
        // return collectiondata.then((response) => response.data);
        return {
            "_id": "643f9fd3be501ad22098f3e4",
            "coverPhoto": "/media/NFTdata/1/2.avif",
            "profilePicture": "/media/NFTdata/1/1.avif",
            "title": "Nakamigos",
            "owner": "Nakamigos-Deployer",
            "earnings": 5,
            "chain": "Ethereum",
            "category": "Virtual Worlds",
            "description": "20,000 unique crypto investors on the blockchain with commercial rights. Twitter: @Nakamigos.",
            "nftOwner": 5761,
            "uniqNFTOwner": 29,
            "childItems": [
                {
                    "_id": "643fd592ffd3b3d22e2bcac4",
                    "profilePicture": "/media/NFTdata/1/child/1.avif",
                    "name": "Nakamigos #19033",
                    "price": 0.26,
                    "lastSalePrice": 0.26,
                    "rarityLevel": 18725,
                    "isListed": true,
                    "__v": 0
                },
                {
                    "_id": "643fd5bda3f6380e47bb8883",
                    "profilePicture": "/media/NFTdata/1/child/3.avif",
                    "name": "Nakamigos #11792",
                    "price": 0.26,
                    "lastSalePrice": 0.41,
                    "rarityLevel": 10407,
                    "isListed": false,
                    "__v": 0
                },
                {
                    "_id": "643fd5f07a4d3e84ccf8c783",
                    "profilePicture": "/media/NFTdata/1/child/4.avif",
                    "name": "Nakamigos #14240",
                    "price": 0.28,
                    "lastSalePrice": 0.72,
                    "rarityLevel": 19217,
                    "isListed": false,
                    "__v": 0
                },
                {
                    "_id": "643fd6886339b8146285210e",
                    "profilePicture": "/media/NFTdata/1/child/2.avif",
                    "name": "Nakamigos #4732",
                    "price": 0.28,
                    "lastSalePrice": 0.41,
                    "rarityLevel": 9280,
                    "isListed": true,
                    "__v": 0
                },
                {
                    "_id": "643fd6ba6af0347a3de7eec4",
                    "profilePicture": "/media/NFTdata/1/child/5.avif",
                    "name": "Nakamigos #19935",
                    "price": 0.288,
                    "lastSalePrice": 0.26,
                    "rarityLevel": 16467,
                    "isListed": true,
                    "__v": 0
                },
                {
                    "_id": "643fd6f05800b17e3ec07cb1",
                    "profilePicture": "/media/NFTdata/1/child/6.avif",
                    "name": "Nakamigos #2559",
                    "price": 0.288,
                    "lastSalePrice": 0.78,
                    "rarityLevel": 17497,
                    "isListed": true,
                    "__v": 0
                }
            ],
            "createDate": "2023-04-19T08:01:23.381Z",
            "__v": 0
        }
    }
}

export default new CollectionService();
