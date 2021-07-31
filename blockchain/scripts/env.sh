#!/bin/bash
export WALLET_PASSWORD=$(cat /root/eosio-wallet/password.txt)
export PRIVATE_KEY=$(cat /keys/key.txt | grep -oP "Private key: \K[^\n]*")
export PUBLIC_KEY=$(cat /keys/key.txt | grep -oP "Public key: \K[^\n]*")
export EOSIO_PRIVATE_KEY=$(cat /keys/eosio_key.txt | grep -oP "Private key: \K[^\n]*")
export EOSIO_PUBLIC_KEY=$(cat /keys/eosio_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet unlock --password $WALLET_PASSWORD >/dev/null 2>&1
