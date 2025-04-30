# 🔐 Blockchain-Based Password Manager with Key Authentication

This project is a secure password manager that uses blockchain technology and cryptographic key authentication to store and manage passwords in a decentralized way.

## 🚀 Features

- 🧠 **Decentralized Storage**: Passwords are stored on the blockchain using smart contracts.
- 🔑 **Key-Based Authentication**: Only users with the correct authentication key can access stored credentials.
- 🐍 **Python-Based Client**: The project includes a Python client to interact with the smart contract (no MetaMask or frontend required).
- 🛡️ **Secure by Design**: Emphasizes privacy, immutability, and tamper resistance.

## 📁 Project Structure

```
password_manager_blockchain/
├── contract/
│   └── PasswordManager.sol      # Solidity smart contract
├── client/
│   └── password_client.py       # Python script to interact with smart contract
├── scripts/
│   └── deploy.py                # Script to deploy smart contract
├── README.md                    # Project documentation
```

## ⚙️ Requirements

- Python 3.x
- [Web3.py](https://web3py.readthedocs.io/en/stable/)
- Ganache or local Ethereum blockchain (for testing)
- Solidity compiler (e.g., `solc`)

Install dependencies:

```bash
pip install web3
```

## 🧪 How to Run

1. Start your local Ethereum blockchain using Ganache.
2. Compile and deploy the smart contract using `deploy.py`.
3. Use the `password_client.py` script to:
   - Add passwords
   - Retrieve passwords
   - Authenticate using secret keys

## ✍️ Usage Example

```bash
python password_client.py --add --site "github.com" --username "youruser" --password "yourpass"
python password_client.py --get --site "github.com"
```

## 🔐 Security Notes

- Authentication is handled via cryptographic keys mapped to Ethereum addresses.
- Make sure to keep your keys secure and never expose them in code.

## 📄 License

This project is licensed under the MIT License.

---

Made with ❤️ by Anugna Sai Kondaveeti
