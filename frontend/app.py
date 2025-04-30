from web3 import Web3
import hashlib
from getpass import getpass  # To securely enter the key without revealing it

# Blockchain connection
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))

if not w3.is_connected():
    print("Failed to connect to blockchain.")
    exit()

# Direct ABI content (no external file)
abi = [
    {
        "inputs": [{"internalType": "uint256", "name": "index", "type": "uint256"}],
        "name": "deletePassword",
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
                    {"internalType": "string", "name": "website", "type": "string"},
                    {"internalType": "string", "name": "encryptedPassword", "type": "string"}
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
            {"internalType": "string", "name": "_website", "type": "string"},
            {"internalType": "string", "name": "_encryptedPassword", "type": "string"}
        ],
        "name": "storePassword",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

# Deployed contract address
contract_address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"  # Update if needed

# Connect to contract
contract = w3.eth.contract(address=contract_address, abi=abi)
w3.eth.default_account = w3.eth.accounts[0]  # Default sender

# Hardcoded login credentials
USERNAME = "admin"
PASSWORD = "admin123"

# The key to be entered before viewing passwords (store securely in real scenarios)
USER_KEY = "supersecretkey"  # Store this securely (e.g., in an environment variable)

# Password hashing function
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Blockchain Functions
def store_credentials(website, password):
    hashed_password = hash_password(password)
    tx_hash = contract.functions.storePassword(website, hashed_password).transact({'from': w3.eth.default_account})
    w3.eth.wait_for_transaction_receipt(tx_hash)
    print("Credentials stored successfully.")

def view_credentials():
    # Prompt for the key
    entered_key = getpass("Enter your key to view passwords: ")  # Hidden input
    if hash_password(entered_key) != hash_password(USER_KEY):
        print("Invalid key. Exiting...")
        exit()

    credentials = contract.functions.getPasswords().call()
    if not credentials:
        print("No credentials stored.")
    else:
        for idx, entry in enumerate(credentials):
            print(f"{idx + 1}. Website: {entry[0]}, Hashed Password: {entry[1]}")

def delete_credentials(index):
    tx_hash = contract.functions.deletePassword(index).transact({'from': w3.eth.default_account})
    w3.eth.wait_for_transaction_receipt(tx_hash)
    print("Credential deleted successfully.")

# Authentication Function
def login():
    print("=== Login Required ===")
    username = input("Enter username: ")
    password = input("Enter password: ")

    if username == USERNAME and password == PASSWORD:
        print("Login successful!\n")
    else:
        print("Invalid credentials. Exiting...")
        exit()

# Main Program
def main():
    login()  # Require login first

    while True:
        print("\n--- Blockchain Password Manager ---")
        print("1. Store Credentials")
        print("2. View Credentials")
        print("3. Delete Credentials")
        print("4. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            website = input("Enter website: ")
            password = input("Enter password: ")
            store_credentials(website, password)
        elif choice == '2':
            view_credentials()  # This will now require a key before showing passwords
        elif choice == '3':
            view_credentials()
            index = int(input("Enter the index (number) to delete: ")) - 1
            delete_credentials(index)
        elif choice == '4':
            print("Goodbye!")
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()
