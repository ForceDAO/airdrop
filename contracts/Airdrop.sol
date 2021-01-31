//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract Airdrop {
    using SafeMath for uint256;

    uint256 private constant THREE_WEEKS_OF_BLOCKS = 135450; // Estimated based on 6450 daily blocks * 7 days * 3 weeks.
    uint256 private constant THREE_DAYS_OF_BLOCKS = 19350;   // Estimated based on 6450 daily blocks * 3 days.

    bytes32 public immutable _rootHash;
    IERC20 public immutable _token;
    uint256 public immutable _blockDeadline;
    uint256 public immutable _blockReductionsBegin;

    mapping (uint256 => uint256) _redeemed;

    constructor(IERC20 token, bytes32 rootHash) {
        
        _token = token;
        _rootHash = rootHash;

        _blockReductionsBegin = block.number
            .add(THREE_WEEKS_OF_BLOCKS);
        
        _blockDeadline = block.number
            .add(THREE_WEEKS_OF_BLOCKS)
            .add(THREE_DAYS_OF_BLOCKS);
    }

    function redeemed(uint256 index) public view returns (bool) {
        uint256 redeemedBlock = _redeemed[index / 256];
        uint256 redeemedMask = (uint256(1) << uint256(index % 256));
        return ((redeemedBlock & redeemedMask) != 0);
    }

    function redeemPackage(uint256 index, address recipient, uint256 amount, bytes32[] memory merkleProof) public {

        require(block.number <= _blockDeadline, "Airdrop: Redemption deadline passed.");

        // Make sure this package has not already been claimed (and claim it)
        uint256 redeemedBlock = _redeemed[index / 256];
        uint256 redeemedMask = (uint256(1) << uint256(index % 256));
        require((redeemedBlock & redeemedMask) == 0, "Airdrop: already redeemed");
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
        uint256 sendAmount = amount;
        if (block.number > _blockReductionsBegin) {
            sendAmount = reducedAmount(amount);
        }

        require(
            IERC20(_token).transfer(recipient, sendAmount),
            "Airdrop: Token transfer fail"
        );

    }

    function reducedAmount(uint256 originalAmount)
        private
        view
        returns (uint256)
    {
        uint256 blocksSinceReductionStarted = block.number
            .sub(_blockReductionsBegin);

        uint256 reduceBy = blocksSinceReductionStarted
            .mul(originalAmount)
            .div(THREE_DAYS_OF_BLOCKS);

        return originalAmount.sub(reduceBy);
    }
}