//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AirDrop {

    bytes32 _rootHash;
    IERC20 _token;

    mapping (uint256 => uint256) _redeemed;

    constructor(IERC20 token, bytes32 rootHash) {
        _token = token;
        _rootHash = rootHash;
    }

    function redeemed(uint256 index) public view returns (bool) {
        uint256 redeemedBlock = _redeemed[index / 256];
        uint256 redeemedMask = (uint256(1) << uint256(index % 256));
        return ((redeemedBlock & redeemedMask) != 0);
    }

    function redeemPackage(uint256 index, address recipient, uint256 amount, bytes32[] memory merkleProof) public {

        // Make sure this package has not already been claimed (and claim it)
        uint256 redeemedBlock = _redeemed[index / 256];
        uint256 redeemedMask = (uint256(1) << uint256(index % 256));
        require((redeemedBlock & redeemedMask) == 0);
        _redeemed[index / 256] = redeemedBlock | redeemedMask;

        // Compute the merkle root
        bytes32 node = keccak256(abi.encode(index, recipient, amount));
        uint256 path = index;
        for (uint16 i = 0; i < merkleProof.length; i++) {
            if ((path & 0x01) == 1) {
                node = keccak256(abi.encode(merkleProof[i], node));
            } else {
                node = keccak256(abi.encode(node, merkleProof[i]));
            }
            path /= 2;
        }

        // Check the merkle proof
        require(node == _rootHash, "Airdrop: Merkle root mismatch");

        // Redeem!
        require(
            IERC20(_token).transfer(recipient, amount),
            "Airdrop: Token transfer fail"
        );

    }
}