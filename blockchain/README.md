

- 1 account del sito - con lo smart contract per gestire gli NFT

cleos set contract ACCOUNT "contract"

struct NFT {owner,url}
TABELLA NFTs

cleos push action ACCOUNT crea_NFT {author,owner,url}

cleos push action ACCOUNT transfer_NFT {owner,to_new_owner}

event eosio.token ontransfer {from,ACCOUNT,qty,{astaID}}
