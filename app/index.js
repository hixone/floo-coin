/*
 * REST API public main entry point on block chain.
 * API descriptions 
 * /balance: return current balance persisted in the current node wallet
 * /blocks: return the current block chain persisted in this node
 * /mine: add a newly-received block to the current chain
 * /transactions: return current transaction pool contents
 * /transact: create a new transaction and broadcast to all connected nodes
 * /mine-transactions: mine the block and add to the block chain
 * /public-key: return wallet's public key
 */

const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain/blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet/wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();

const blockChainInstance = new Blockchain();
const wallet = new Wallet();
const transactionPoolInstance = new TransactionPool();
const p2pServer = new P2pServer(blockChainInstance, transactionPoolInstance);
const miner = new Miner(blockChainInstance, transactionPoolInstance, wallet, p2pServer);

app.use(bodyParser.json());

app.get('/balance', (req, res) => {
    res.json([{ balance: JSON.stringify(wallet.calculateBalance(blockChainInstance)) }])
});

app.get('/blocks', (req, res) => {
    res.json(blockChainInstance.getChain());
});

app.post('/mine', (req, res) => {
    const block = blockChainInstance.addBlock(req.body.data);
    console.log(`New block is added: ${block.toString()}`);

    /* Synchronize with other nodes once mining is done */
    p2pServer.syncChain();

    res.redirect('/blocks');
});

app.get('/transactions', (req, res) => {
    res.json(transactionPoolInstance.getTransactions());
});

app.post('/transact', (req, res) => { //calculate received transaction
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, blockChainInstance, transactionPoolInstance);
    p2pServer.broadcastTransaction(transaction);

    res.redirect('/transactions');
});

app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`);

    res.redirect('./blocks');
});

app.get('/public-key', (req, res) => {
    res.json([{ address: wallet.getPublicKey() }]);
});

app.listen(HTTP_PORT, () => console.log(`Listening on port ${HTTP_PORT}`));
p2pServer.listen();