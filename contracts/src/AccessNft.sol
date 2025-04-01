// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GameAccessNFT is ERC721, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 private _currentTokenId = 0;

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public mintPrice = 0.0001 ether;
    string private _TokenURI;

    // Track if a user has minted
    mapping(address => bool) public hasMinted;

    // Events
    event Minted(address indexed to, uint256 indexed tokenId);
    event BaseURIUpdated(string newBaseURI);

    constructor() ERC721("GameAccessNFT", "GAN") Ownable(msg.sender) {
        _currentTokenId = 1; // Start from token ID 1 to match previous behavior
    }

    function mint() external payable {
        // Check mint conditions
        require(!hasMinted[msg.sender], "You have already minted");
        require(_currentTokenId < MAX_SUPPLY, "Would exceed max supply");
        require(msg.value >= mintPrice, "Insufficient payment");

        // Mint token
        uint256 tokenId = _currentTokenId;
        _safeMint(msg.sender, tokenId);
        _currentTokenId++;

        // Mark user as minted
        hasMinted[msg.sender] = true;

        emit Minted(msg.sender, tokenId);
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _TokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }

    /**
     * @dev Base URI for computing {tokenURI}
     * @return string The base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _TokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        return
            string(abi.encodePacked(_baseURI(), tokenId.toString(), ".json"));
    }

    /**
     * @dev Returns if the user owns any token from the collection
     * @param user Address to check
     * @return bool Whether the user owns at least one token
     */
    function hasAccess(address user) external view returns (bool) {
        return balanceOf(user) > 0;
    }

    function withdraw() external onlyOwner nonReentrant {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Returns current token supply
     * @return uint256 Current supply
     */
    function currentSupply() external view returns (uint256) {
        return _currentTokenId - 1;
    }
}
