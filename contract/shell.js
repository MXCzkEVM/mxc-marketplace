network
/* 
--network wannsee
--network taiku
--network sepolia
*/

scripts
/* 
hh run scripts/layer2.js --network wannsee
*/

test
/* 
hh test test/unit/MXCCollection.test.js
hh test test/unit/MXCCollectionFactory.test.js

hh console --network wannsee
await network.provider.send("eth_blockNumber", [])
*/

deploy
/* 
hh deploy --tags bridgeL1 --network arbiture_goerli
hh deploy --tags bridgeL2 --network wannsee
*/
