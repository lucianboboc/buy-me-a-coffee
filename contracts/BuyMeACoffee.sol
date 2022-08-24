// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

// Deployed to Goerli at: 0x7739eFafb279288dfa46DC75F3A550c881Ff6785
// New Deployed Contract: 0xA5d9aC5fa83571ebEdE6d878eaC80B57F54c918A

contract BuyMeACoffee {
    // Event to emit when a memo is created.
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Memo struct.
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // List of all memos received from friends.
    Memo[] memos;

    // Address of contract deployer.
    address payable owner;
    address payable withdrawer;

    constructor() {
        owner = payable(msg.sender);
        withdrawer = payable(msg.sender);
    }

    /**
     * @dev buy a coffee for contract owner
     * @param _name name of the coffee buyer
     * @param _message a nice message from the coffee buyer
     */
    function buyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 0, "can't buy coffee with 0 eth");

        // Add the memo to storage!
        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        // Emit a log event when a new memo is created
        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    /**
     * @dev send the entire balance stored in this contract to the owner
     */
    function withdrawTips() public {
        require(withdrawer.send(address(this).balance));
    }

    /**
     * @dev change the withdrawer
     */
    function changeWithdrawer(address payable _to) public {
        require(msg.sender == owner, "only owner can change the withdrawer");
        withdrawer = payable(_to);
    }

    /**
     * @dev retrieve all the memos received and stored on the blockchain
     */
    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }
}
