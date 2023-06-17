network
/* 
--network wannsee
--network taiku
--network sepolia
*/

scripts
/* 
hh run scripts/layer2.js --network wannsee
hh run scripts/layer2.js --network taiku
hh run scripts/layer1.js --network arbiture_goerli
hh run scripts/bridge.js --network arbiture_goerli
hh run scripts/core.js --network wannsee
hh run scripts/bridge/bridgeL2.js --network wannsee

hh run scripts/testnet.js
hh run scripts/contracts.js
hh run scripts/swap.js
hh run scripts/aave/index.js --network wannsee
hh run scripts/aave/index.js --network ganache
hh run scripts/swap.js --network wannsee

*/

test
/* 
hh test test/unit/Faucet.test.js
hh test test/unit/GetInitHash.test.js
hh test test/unit/token/MXCToken.test.js
hh test test/unit/token/DHXToken.test.js
hh test test/unit/token/GRYDToken.test.js
hh test test/unit/chainlink/MockAggregator.test.js

hh console --network wannsee
await network.provider.send("eth_blockNumber", [])
*/

deploy
/* 
[bridge]
hh deploy --tags bridgeL1 --network arbiture_goerli
hh deploy --tags bridgeL2 --network wannsee

hh deploy --tags simpleStorage --network wannsee
hh deploy --tags grydToken --network wannsee
hh deploy --network taiku
hh deploy --network wannsee
hh deploy --tags dhxToken --network wannsee
hh deploy --tags bridge_faucet --network wannsee
hh deploy --tags xsdTokenTest --network wannsee

[aave]
hh deploy --tags aave-oracle --network wannsee
hh deploy --tags aave-token --network wannsee
*/
