require('dotenv').config();
const net = require("../util/net");

const endpoint = "/api/v1/wallet/listaddresses";

console.log("Testing SCP API connection...");
net.get("http://" + process.env.API_HOST + ":" + process.env.API_PORT + endpoint).then((res) => console.log("API response: " + res));