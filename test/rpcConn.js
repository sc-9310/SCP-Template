require('dotenv').config();
const rpc = require("../util/rpc");

console.log("Testing SCC RPC connection...");
const scc = new rpc(process.env.RPC_USERNAME, process.env.RPC_PASSWORD, process.env.RPC_HOST, process.env.RPC_PORT);
scc.call('getblockcount').then((res) => console.log("Fullnode blockheight: " + res));