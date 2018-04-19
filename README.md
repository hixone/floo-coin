# floo-coin


Block Synchronization issue

1. Create a new pool, mining pool, that includes only the transactions that meet the condition. 
   
     ex 1. the timestamp of the last block + 60000*5.=> all transactions that happened within the 5 minutes from the birth of last block.
     
     
2. Each node broadcasts the hash of its mining pool.

3. Of the received hashes from other nodes, analyze if there is a majority and if the majority hash is over 50% of the received hashes.

4. If the majority hash is the same hash as the node created, start mining the mining pool. If not, flush the mining pool and stay idle for the mining of this block.

