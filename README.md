# floo-coin

#Issues

1) Block Synchronization issue

1. Create a new pool, mining pool, that includes only the transactions that meet the condition. ----Done 
   
     ex 1. the timestamp of the last block + 60000*5.=> all transactions that happened within the 5 minutes from the birth of last block.
     
     
2. Each node broadcasts the hash of its mining pool. ----Done

3. Of the received hashes from other nodes, analyze if there is a majority and if the majority hash is over 50% of the received hashes.

4. If the majority hash is the same hash as the node created, start mining the mining pool. If not, flush the mining pool and stay idle for the mining of this block.

2) Node.js Clustering

Background:
In general, any CPU intensive operation annuls all the throughput benefits Node.js offers with its event-driven, non-blocking I/O model because any incoming requests will be blocked while the thread is occupied.

1. While a node is mining, other operations such as making transactions or reading balance cannot be performed. 
2. Must enable clustering otherwise move to another environment.
