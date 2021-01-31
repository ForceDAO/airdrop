// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.3;

import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";


contract AirdropToken is ERC20PresetMinterPauser {

    constructor (string memory name, string memory symbol)
        ERC20PresetMinterPauser(name, symbol)
    {

    }
}