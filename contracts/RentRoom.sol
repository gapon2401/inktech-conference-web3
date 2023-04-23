// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract RentRoom is Ownable {

    uint256 constant PRICE = 0.01 ether;

    address public roomOwner;
    uint256 public roomExpires;

    /**
     * @notice Paying for rent
     */
    function pay(uint256 periodInDays) external payable {
        uint256 totalPrice = periodInDays * PRICE;

        require(!isRoomOccupied(), 'ROOM_OCCUPIED');
        require(msg.value >= totalPrice, 'INVALID_PRICE');

        roomOwner = msg.sender;
        roomExpires = block.timestamp + periodInDays * 1 days;

        if (msg.value > totalPrice) {
            Address.sendValue(payable(msg.sender), msg.value - totalPrice);
        }
    }



    /**
     * @notice Gets room code only for the payer
     */
    function getRoomCode() public view returns (uint256) {
        require(msg.sender == roomOwner, 'NOT_ROOM_OWNER');

        return generateRandomCode();
    }

    /**
     * @notice Allow withdrawing funds
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        Address.sendValue(payable(msg.sender), balance);
    }

    /**
     * @notice Contract might receive/hold ETH as part of the maintenance process.
     */
    receive() external payable {}

    /**
     * @notice Generates random OTP
     */
    function generateRandomCode() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 1000000;
    }

    /**
     * @notice Checks if room is occupied
     */
    function isRoomOccupied() private view returns (bool) {
        return roomExpires != 0 && roomExpires >  block.timestamp;
    }

}
