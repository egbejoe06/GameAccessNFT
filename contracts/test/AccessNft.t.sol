// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "src/AccessNft.sol";

contract GameAccessNFTTest is Test {
    GameAccessNFT public nft;
    address owner = address(0x1);
    address user1 = address(0x2);
    address user2 = address(0x3);
    uint256 mintPrice = 0.0001 ether;

    function setUp() public {
        vm.startPrank(owner);
        nft = new GameAccessNFT();
        vm.stopPrank();
    }

    function testMint() public {
        vm.prank(user1);
        vm.deal(user1, mintPrice);
        nft.mint{value: mintPrice}();
        assertEq(nft.balanceOf(user1), 1);
        assertTrue(nft.hasMinted(user1));
    }

    function testMintFailsWhenAlreadyMinted() public {
        vm.prank(user1);
        vm.deal(user1, mintPrice);
        nft.mint{value: mintPrice}();

        vm.expectRevert("You have already minted");
        vm.prank(user1);
        nft.mint{value: mintPrice}();
    }

    function testMintFailsIfInsufficientFunds() public {
        vm.prank(user1);
        vm.expectRevert("Insufficient payment");
        nft.mint{value: mintPrice - 1}();
    }

    function testHasAccess() public {
        vm.prank(user1);
        vm.deal(user1, mintPrice);
        nft.mint{value: mintPrice}();
        assertTrue(nft.hasAccess(user1));
    }

    function testSetBaseURI() public {
        string memory newBaseURI = "https://newbase.com/";
        vm.prank(owner);
        nft.setBaseURI(newBaseURI);
        assertEq(
            nft.tokenURI(1),
            string(abi.encodePacked(newBaseURI, "1.json"))
        );
    }

    function testWithdraw() public {
        vm.prank(user1);
        vm.deal(user1, mintPrice);
        nft.mint{value: mintPrice}();

        uint256 ownerBalanceBefore = owner.balance;
        vm.prank(owner);
        nft.withdraw();
        uint256 ownerBalanceAfter = owner.balance;

        assertEq(ownerBalanceAfter, ownerBalanceBefore + mintPrice);
    }
}
