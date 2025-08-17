// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {HackerHouseProtocol} from "src/HackerHouseProtocol.sol";

contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address treasury = vm.envAddress("TREASURY");
        address verifier = vm.envAddress("VERIFIER"); // backend signer (optional now)

        vm.startBroadcast(pk);
        HackerHouseProtocol p = new HackerHouseProtocol(treasury);
        if (verifier != address(0)) p.setVerifier(verifier);
        // p.setProtocolFeeBps(0); // default 0 anyway
        vm.stopBroadcast();

        console2.log("Protocol:", address(p));
    }
}
