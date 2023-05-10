//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWhitelist.sol";

contract dev is ERC721Enumerable, Ownable {
    //URI - Uniform Resource Identifier
    //Eg: if _baseTokenURI is set to "https://example.com/token/" and the tokenId is 123, the resulting token URI would be "https://example.com/token/123".
    string _baseTokenURI;
    IWhitelist whitelist;   //instance of interface

    

    uint256 public _price = 0.001 ether;
    bool public _paused; //to pause the contract for some xyz reaons.
    uint256 public maxTokenIds = 20;
    uint256 public tokenIds;     //total no. of token Ids minted.
    
    bool public presaleStarted;     //says if presale has started or not.
    uint256 public presaleEnd;      //timestamp of when it is gonna end
    constructor(string memory _baseURI, address whitelistContract) ERC721("Dev NFT", "DN"){
        _baseTokenURI=_baseURI;
        whitelist=IWhitelist(whitelistContract);
    }

    function startPresale() public onlyOwner {
        presaleStarted = true;
        presaleEnd=block.timestamp + 50 minutes;
    }


}
