const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // ✅ Updated your correct deployed address

    const PasswordManager = await ethers.getContractFactory("PasswordManager");
    const passwordManager = PasswordManager.attach(contractAddress);

    // Example: Storing a password
    const tx = await passwordManager.storePassword("example.com", "encrypted1234");
    await tx.wait();
    console.log("Password stored successfully!");

    // Example: Reading passwords
    const passwords = await passwordManager.getPasswords();
    console.log(passwords);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
