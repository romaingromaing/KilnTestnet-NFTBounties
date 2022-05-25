//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Counter {
    uint256 private counter;

    constructor() {
        counter = 0;
    }

    function increase() external {
        ++counter;
    }

    function getCounter() external view returns(uint256) {
        return counter;
    }
}
