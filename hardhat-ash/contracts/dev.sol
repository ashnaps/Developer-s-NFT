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

    bool public _paused; //to pause the contract for some xyz reaons.

    modifier onlyWhenNotPaused{
        require(!_paused,"contract currently puased");
        _;
    }

    uint256 public _publicPrice = 0.001 ether;
    uint256 public _presalePrice = 0.0001 ether;
    
    uint256 public maxTokenIds = 20;
    uint256 public tokenIds;     //total no. of token Ids minted.
    
    bool public presaleStarted;     //says if presale has started or not.
    uint256 public presaleEnded;      //timestamp of when it is gonna end
    constructor(string memory baseURI, address whitelistContract) ERC721("Dev NFT", "DN"){
        _baseTokenURI=baseURI;
        whitelist=IWhitelist(whitelistContract);
    }

    function startPresale() public onlyOwner {
        presaleStarted = true;
        presaleEnded=block.timestamp + 50 minutes;
    }

    function presaleMint() public payable onlyWhenNotPaused {
        require(presaleStarted && block.timestamp < presaleEnded, "Presale ended");
        require(whitelist.whitelistedAdrress(msg.sender), "You are not in the whitelist");
        require(tokenIds < maxTokenIds, "Exceeded the limit");
        require(msg.value >= _presalePrice,"Ether insufficient");
        tokenIds += 1;
        _safeMint(msg.sender,tokenIds);     //syntax:- (to,tokenid is the unique identifier of a token), it also checks if the address is non-zero. Check openzeppline for more.
    }
    function mint() public payable onlyWhenNotPaused {
        require(presaleStarted && block.timestamp >= presaleEnded, "Presale has not ended yet");
        require(tokenIds < maxTokenIds,"Exceeded the limit");
        require(msg.value >= _publicPrice, "Insufficient funds!");
        tokenIds += 1;
        _safeMint(msg.sender, tokenIds);
    }

    
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    //Openzeppelin's ERC721 by default returned an empty string for the baseURI

    //to prevent spams
    function setPaused(bool val) public onlyOwner {
        _paused = val;
    }


    //withdraw function to get eth from contract to ownser address
    function withdraw() public onlyOwner {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) = _owner.call{value: amount}("");
        require(sent, "failed to send ether");
    }
//to receive money from the customer. recieve() can accept only funds but fallback accepts data(msg.data) as well, i,e from the user. So adding both just incase.
    receive() external payable{}
    fallback() external payable{}
    

}
