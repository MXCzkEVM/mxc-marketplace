// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicNft is ERC721 {
    string public constant TOKEN_URI =
        "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
    uint256 private s_tokenCounter;

    constructor(
        string memory _name,
        string memory _symbal
    ) ERC721(_name, _symbal) {
        s_tokenCounter = 0;
    }

    function mintNft() public {
        _safeMint(msg.sender, s_tokenCounter);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function mintMultNft(uint256 numberOfNfts) public payable {
        //检查numberOfNFT在(0,20]
        require(numberOfNfts > 0 && numberOfNfts <= 20);

        //执行for循环, 每个循环里都触发mint一次, 写入一个全局变量
        for (uint i = 0; i < numberOfNfts; i++) {
            _safeMint(msg.sender, s_tokenCounter);
            s_tokenCounter = s_tokenCounter + 1;
        }
    }

    function tokenURI(
        uint256 /* tokenId */
    ) public pure override returns (string memory) {
        // require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return TOKEN_URI;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
