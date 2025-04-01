// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {GameAccessNFT} from "../src/AccessNft.sol";

contract DeployGameAccessNFT is Script {
    GameAccessNFT public gameAccessNFt;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        gameAccessNFt = new GameAccessNFT();

        vm.stopBroadcast();
    }
}
