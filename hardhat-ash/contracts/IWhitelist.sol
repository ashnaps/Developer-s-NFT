//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
//to check if the input address is in the whitelist or not
interface IWhitelist{
    function whitelistedAdrress(address) external view returns (bool);
}