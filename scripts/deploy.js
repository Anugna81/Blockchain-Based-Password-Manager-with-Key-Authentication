async function main() {
    const PasswordManager = await ethers.getContractFactory("PasswordManager");
    const passwordManager = await PasswordManager.deploy();

    // Wait until the contract is actually deployed
    await passwordManager.waitForDeployment();

    console.log(`Contract deployed to: ${passwordManager.target}`);
}

// Handle errors properly
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
