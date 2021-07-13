#!/bin/bash

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
	cleos wallet create -f /root/eosio-wallet/password.txt
	cleos create key -f /root/eosio-wallet/key.txt
fi

source /root/env.sh

if [[ $FIRST_INSTALL == 1 ]]; then
	cleos wallet import --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
	cleos wallet import --private-key $PRIVATE_KEY

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

	cleos create account eosio $ACCOUNT $PUBLIC_KEY >>/root/setup_error

	if [[ -f /contracts/$CONTRACT/build/$CONTRACT/$CONTRACT.wasm ]]; then
		cleos set contract $ACCOUNT /contracts/$CONTRACT/build/$CONTRACT
	fi
fi
