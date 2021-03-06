const Wallet = require('../wallet/wallet');
const Transaction = require('../wallet/transaction');



class Miner {
    constructor(blockchain, transactionPool, wallet, p2pServer) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    /*
     * Mining behavior definition:
       1. get transactions from the pool 
       2. add a new block to the existing block chain
       3. sync-up chains
       4. broadcast a mining result via p2pServer 
     */

    mine() {
        const lastBlockTime=this.blockchain.returnLastBlockTimeStamp();
        const validTransactions = this.transactionPool.validTransactions(this.blockchain);
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
        const block = this.blockchain.addBlock(validTransactions);
        
        this.p2pServer.syncChain();
        this.p2pServer.broadcastClearTransactions(lastBlockTime);
        this.transactionPool.clear(lastBlockTime);

        return block;
    }
}

module.exports = Miner;