#!/bin/bash

ROOT_DIR="/opt"
CONTRACTS_DIR="$ROOT_DIR/eosio/bin/contracts"

function post_preactivate {
	curl -X POST http://127.0.0.1:8888/v1/producer/schedule_protocol_feature_activations -d '{"protocol_features_to_activate": ["0ec7e080177b2c02b278d5088611686b49d739925a92d9bfcacd7fc6b74053bd"]}'
}

# $1 feature disgest to activate
function activate_feature {
	cleos push action eosio activate '["'"$1"'"]' -p eosio
	if [ $? -ne 0 ]; then
		exit 1
	fi
}

# cp -R /usr/local/eosio.cdt/include/* /eosio.cdt/
cp -R /usr/opt/eosio.cdt/1.8.0/include/* /eosio.cdt/

pkill nodeos
pkill keosd

if [[ $1 == "reset" ]]; then
	rm /data/nodeos.log
	rm /root/eosio-wallet/*
	rm -R /root/.local/share/eosio/nodeos/data/*
fi

if [[ ! -f /root/eosio-wallet/default.wallet ]]; then
	FIRST_INSTALL=1
fi

if [[ $1 == "reset" ]]; then
	nodeos -e -p eosio --delete-all-blocks --plugin eosio::producer_plugin --plugin eosio::producer_api_plugin --plugin eosio::chain_api_plugin --plugin eosio::http_plugin --http-server-address=0.0.0.0:8888 --plugin eosio::history_plugin --plugin eosio::history_api_plugin --filter-on="*" --access-control-allow-origin="*" --contracts-console --http-validate-host=false --verbose-http-errors >>/data/nodeos.log 2>&1 &
elif [[ $1 == "replay" ]]; then
	nodeos -e -p eosio --hard-replay-blockchain --plugin eosio::producer_plugin --plugin eosio::producer_api_plugin --plugin eosio::chain_api_plugin --plugin eosio::http_plugin --http-server-address=0.0.0.0:8888 --plugin eosio::history_plugin --plugin eosio::history_api_plugin --filter-on="*" --access-control-allow-origin="*" --contracts-console --http-validate-host=false --verbose-http-errors >>/data/nodeos.log 2>&1 &
else
	nodeos -e -p eosio --plugin eosio::producer_plugin --plugin eosio::producer_api_plugin --plugin eosio::chain_api_plugin --plugin eosio::http_plugin --http-server-address=0.0.0.0:8888 --plugin eosio::history_plugin --plugin eosio::history_api_plugin --filter-on="*" --access-control-allow-origin="*" --contracts-console --http-validate-host=false --verbose-http-errors >>/data/nodeos.log 2>&1 &
	sleep 1
	REPLAY=$(tail -n 1 /data/nodeos.log | grep "replay required")
	if [[ ! -z $REPLAY ]]; then
		echo "REPLAY NEEDED\n"
		nodeos -e -p eosio --hard-replay-blockchain --plugin eosio::producer_plugin --plugin eosio::producer_api_plugin --plugin eosio::chain_api_plugin --plugin eosio::http_plugin --http-server-address=0.0.0.0:8888 --plugin eosio::history_plugin --plugin eosio::history_api_plugin --filter-on="*" --access-control-allow-origin="*" --contracts-console --http-validate-host=false --verbose-http-errors >>/data/nodeos.log 2>&1 &
	fi
fi

if [[ $FIRST_INSTALL == 1 ]]; then
	cleos wallet create -f /root/eosio-wallet/password.
	if [ ! -f /keys/key.txt ]; then
		cleos create key -f /keys/key.txt
		cleos create key -f /keys/eosio_key.txt
	fi
fi

source /root/env.sh

timeout=5

while [ ! -f /data/nodeos.log ]; do
	if [ "$timeout" == 0 ]; then
		echo "ERROR: Timeout while waiting for the file /data/nodeos.log" >>/root/setup_error
		exit 1
	fi
	sleep 1
	((timeout--))
done

sleep 1

timeout=10
STARTED=$(tail -n 1 /data/nodeos.log | grep "produce_block")
while [[ -z $STARTED ]]; do
	if [ "$timeout" == 0 ]; then
		echo "ERROR: Timeout while waiting started - $STARTED" >>/root/setup_error
		exit 1
	fi
	sleep 1
	STARTED=$(tail -n 1 /data/nodeos.log | grep "produce_block")
	((timeout--))
done

sleep 1

if [[ $FIRST_INSTALL == 1 ]]; then
	cleos wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3 # eosio default dev key
	cleos wallet import --private-key $EOSIO_PRIVATE_KEY
	cleos wallet import --private-key $PRIVATE_KEY

	cleos create account eosio eosio.token $EOSIO_PUBLIC_KEY >>/root/setup_error
	cleos create account eosio eosio.msig $EOSIO_PUBLIC_KEY >>/root/setup_error

	cleos set contract eosio.token /contracts/eosio.token
	cleos set contract eosio.msig /contracts/eosio.msig

	cleos push action eosio.token create '[ "eosio", "10000000000.0000 EOS" ]' -p eosio.token@active
	cleos push action eosio.token issue '[ "eosio", "1000000000.0000 EOS", "memo" ]' -p eosio@active

	cleos create account eosio $ACCOUNT $PUBLIC_KEY >>/root/setup_error
	cleos push action eosio.token transfer '[ "eosio", "mebtradingvg", "25000.0000 EOS", "memo" ]' -p eosio@active

	post_preactivate
	sleep 1s

	cleos set contract eosio /contracts/eosio.boot

	sleep 1s
	activate_feature "299dcb6af692324b899b39f16d5a530a33062804e41f09dc97e9f156b4476707"
	activate_feature "825ee6288fb1373eab1b5187ec2f04f6eacb39cb3a97f356a07c91622dd61d16"
	activate_feature "c3a6138c5061cf291310887c0b5c71fcaffeab90d5deb50d3b9e687cead45071"
	activate_feature "4e7bf348da00a945489b2a681749eb56f5de00b900014e137ddae39f48f69d67"
	activate_feature "f0af56d2c5a48d60a4a5b5c903edfb7db3a736a94ed589d0b797df33ff9d3e1d"
	activate_feature "2652f5f96006294109b3dd0bbde63693f55324af452b799ee137a81a905eed25"
	activate_feature "8ba52fe7a3956c5cd3a656a3174b931d3bb2abb45578befc59f283ecd816a405"
	activate_feature "ad9e3d8f650687709fd68f4b90b41f7d825a365b02c23a636cef88ac2ac00c43"
	activate_feature "68dcaa34c0517d19666e6b33add67351d8c5f69e999ca1e37931bc410a297428"
	activate_feature "e0fb64b1085cc5538970158d05a009c24e276fb94e1a0bf6a528b48fbc4ff526"
	activate_feature "ef43112c6543b88db2283a2e077278c315ae2c84719a8b25f25cc88565fbea99"
	activate_feature "4a90c00d55454dc5b059055ca213579c6ea856967712a56017487886a4d4cc0f"
	activate_feature "1a99a59d87e06e09ec5b028a9cbb7749b4a5ad8819004365d02dc4379a8b7241"
	activate_feature "bf61537fd21c61a60e542a5d66c3f6a78da0589336868307f94a82bccea84e88"
	activate_feature "5443fcf88330c586bc0e5f3dee10e7f63c76c00249c87fe4fbf7f38c082006b4"

	cleos set contract eosio /contracts/eosio.bios

fi

sleep 1
if [[ -f /contracts/$CONTRACT/build/$CONTRACT/$CONTRACT.wasm ]]; then
	cleos set contract $ACCOUNT /contracts/$CONTRACT/build/$CONTRACT
fi
