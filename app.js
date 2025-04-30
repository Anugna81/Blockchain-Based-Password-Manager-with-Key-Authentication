const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS"; // Replace this
const abi = [
    {
        "inputs": [
            { "internalType": "string", "name": "_website", "type": "string" },
            { "internalType": "string", "name": "_encryptedPassword", "type": "string" }
        ],
        "name": "storePassword",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getPasswords",
        "outputs": [
            {
                "components": [
                    { "internalType": "string", "name": "website", "type": "string" },
                    { "internalType": "string", "name": "encryptedPassword", "type": "string" }
                ],
                "internalType": "struct PasswordManager.PasswordEntry[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "index", "type": "uint256" }
        ],
        "name": "deletePassword",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

async function getProviderAndSigner() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return { provider, signer };
}

function encryptPassword(password, key) {
    return btoa(password + key); // very simple fake encryption (Base64 + key)
}

function decryptPassword(encrypted, key) {
    const decrypted = atob(encrypted);
    return decrypted.replace(key, "");
}

async function storePassword() {
    const website = document.getElementById('website').value;
    const password = document.getElementById('password').value;
    const secretKey = document.getElementById('secretKey').value;

    if (!website || !password || !secretKey) {
        alert("Please fill all fields!");
        return;
    }

    const encryptedPassword = encryptPassword(password, secretKey);
    const { signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.storePassword(website, encryptedPassword);
    await tx.wait();
    alert("Password stored successfully!");
}

async function loadPasswords() {
    const secretKey = prompt("Enter your secret key to decrypt:");

    if (!secretKey) {
        alert("Secret key is required!");
        return;
    }

    const { signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const passwords = await contract.getPasswords();
    const passwordList = document.getElementById('passwordList');
    passwordList.innerHTML = "";

    passwords.forEach((entry, index) => {
        const li = document.createElement('li');
        const decryptedPassword = decryptPassword(entry.encryptedPassword, secretKey);
        li.innerHTML = `Website: ${entry.website} | Password: ${decryptedPassword} 
            <button onclick="deletePassword(${index})">Delete</button>`;
        passwordList.appendChild(li);
    });
}

async function deletePassword(index) {
    const { signer } = await getProviderAndSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.deletePassword(index);
    await tx.wait();
    alert("Password deleted!");
    loadPasswords();
}