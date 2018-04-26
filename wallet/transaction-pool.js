const Transaction = require('../wallet/transaction');
const Blockchain = require('../blockchain/blockchain');
const array = require('arrays-difference');

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);

        if (transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;

        } else {
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }

    validTransactions(blockchain) {
        return this.transactions.filter(transaction => {
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);

            if (transaction.input.amount !== outputTotal) {
                console.log(`Invalid transaction from ${transaction.input.address}.`);
                return;
            }
            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid siganture from ${transaction.input.address}.`);
                return;

            }
            if (transaction.input.timestamp > blockchain.showTimestamp() + 5000) {
                return;
            }
            return transaction;
        });
    }

    clear(arrays) {
        const difference = array(this.transactions, arrays);
        this.transactions = difference;
    }
}

module.exports = TransactionPool;