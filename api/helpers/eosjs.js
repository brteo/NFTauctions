const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');

const { EOS_ENDPOINT, EOS_KEY } = process.env;

const signatureProvider = new JsSignatureProvider([EOS_KEY]);

const rpc = new JsonRpc(EOS_ENDPOINT, { fetch });

module.exports = new Api({
	rpc,
	signatureProvider,
	textDecoder: new TextDecoder(),
	textEncoder: new TextEncoder()
});

/*
var CryptoJS = require("crypto-js");

// Encrypt and save into a external file
var cipherKey = CryptoJS.AES.encrypt('my private key', 'secret password').toString();


// Decrypt in your code
var bytes  = CryptoJS.AES.decrypt(cipherKey , 'secret password');
var privateKey= bytes.toString(CryptoJS.enc.Utf8);

console.log(privateKey); //'mi private key'
*/

/*
module.exports = sp =>
	new Api({
		rpc,
		signatureProvider: sp || signatureProvider,
		textDecoder: new TextDecoder(),
		textEncoder: new TextEncoder()
	});
*/
