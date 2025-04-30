// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PasswordManager {

    struct PasswordEntry {
        string website;
        string encryptedPassword;
    }

    mapping(address => PasswordEntry[]) private userPasswords;

    function storePassword(string memory _website, string memory _encryptedPassword) public {
        PasswordEntry memory newEntry = PasswordEntry({
            website: _website,
            encryptedPassword: _encryptedPassword
        });

        userPasswords[msg.sender].push(newEntry);
    }

    function getPasswords() public view returns (PasswordEntry[] memory) {
        return userPasswords[msg.sender];
    }

    function deletePassword(uint index) public {
        require(index < userPasswords[msg.sender].length, "Invalid index");

        for (uint i = index; i < userPasswords[msg.sender].length - 1; i++) {
            userPasswords[msg.sender][i] = userPasswords[msg.sender][i + 1];
        }

        userPasswords[msg.sender].pop();
    }
}
