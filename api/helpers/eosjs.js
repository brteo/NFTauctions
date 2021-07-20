const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const keyConversions = require('eosjs/dist/eosjs-key-conversions');
const fetch = require('node-fetch');
const { TextEncoder, TextDecoder } = require('util');

const { EOS_ENDPOINT, EOS_KEY } = process.env;

const signatureProvider = new JsSignatureProvider([EOS_KEY]);

const rpc = new JsonRpc(EOS_ENDPOINT, { fetch });

const eos = new Api({
	rpc,
	signatureProvider,
	textDecoder: new TextDecoder(),
	textEncoder: new TextEncoder()
});

module.exports = {
	eos,
	addKey: key => {
		if (!key) return;
		const priv = keyConversions.PrivateKey.fromString(key);
		const pub = priv.getPublicKey().toString();

		// const eos_ecc = require('eosjs-ecc');
		// const pub = Numeric.convertLegacyPublicKey(eos_ecc.PrivateKey.fromString(key).toPublic().toString());

		if (!eos.signatureProvider.keys.has(pub)) {
			eos.signatureProvider.keys.set(pub, priv.toElliptic());
			eos.signatureProvider.availableKeys.push(pub);
		}
	},
	generateKeys: () => {
		const key = keyConversions.generateKeyPair(0, { secureEnv: true });
		return { private: key.privateKey.toLegacyString(), public: key.publicKey.toLegacyString() };
	}
};

/*
module.exports = sp =>
	new Api({
		rpc,
		signatureProvider: sp || signatureProvider,
		textDecoder: new TextDecoder(),
		textEncoder: new TextEncoder()
	});
*/
