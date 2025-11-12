// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {MyNFT} from "../src/MyNFT.sol";

contract DeployMyNFT is Script {
    function run() external {
        // 개인키로 브로드캐스트 시작
        uint256 pk = vm.envUint("PRIVATE_KEY"); // 또는 vm.envBytes32("PRIVATE_KEY")
        vm.startBroadcast(pk);

        MyNFT nft = new MyNFT();
        console2.log("MyNFT deployed to:", address(nft));

        vm.stopBroadcast();
    }
}