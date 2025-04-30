require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const Web3 = require("web3");
const contractABI = require("./abi.json");

const app = express();
app.use(bodyParser.json());

const web3 = new Web3(process.env.LOCAL_RPC);
const contract = new web3.eth.Contract(contractABI, process.env.CONTRACT_ADDRESS);
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

app.post("/store", async (req, res) => {
    const { username, site, encryptedPassword } = req.body;
    try {
        const tx = contract.methods.storePassword(username, site, encryptedPassword);
        const gas = await tx.estimateGas({ from: account.address });
        const txData = {
            from: account.address,
            to: process.env.CONTRACT_ADDRESS,
            data: tx.encodeABI(),
            gas,
        };
        const signedTx = await web3.eth.accounts.signTransaction(txData, process.env.PRIVATE_KEY);
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.json({ success: true, txHash: receipt.transactionHash });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get("/get/:username", async (req, res) => {
    try {
        const data = await contract.methods.getPasswords(req.params.username).call();
        res.json({ success: true, passwords: data });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
