if [ ! -f /keys/tvgadmin_key.txt ]; then
	cleos create key -f /keys/tvgadmin_key.txt
fi
if [ ! -f /keys/tvguser1_key.txt ]; then
	cleos create key -f /keys/tvguser1_key.txt
fi
if [ ! -f /keys/tvguser2_key.txt ]; then
	cleos create key -f /keys/tvguser2_key.txt
fi
if [ ! -f /keys/tvguser3_key.txt ]; then
	cleos create key -f /keys/tvguser3_key.txt
fi
if [ ! -f /keys/tvguser4_key.txt ]; then
	cleos create key -f /keys/tvguser4_key.txt
fi
if [ ! -f /keys/tvguser5_key.txt ]; then
	cleos create key -f /keys/tvguser5_key.txt
fi
if [ ! -f /keys/tvguser14_key.txt ]; then
	cleos create key -f /keys/tvguser14_key.txt
fi
if [ ! -f /keys/tvguser11_key.txt ]; then
	cleos create key -f /keys/tvguser11_key.txt
fi
if [ ! -f /keys/tvguser12_key.txt ]; then
	cleos create key -f /keys/tvguser12_key.txt
fi
if [ ! -f /keys/tvguser13_key.txt ]; then
	cleos create key -f /keys/tvguser13_key.txt
fi

// ADMIN
PRIV_KEY=$(cat /keys/tvgadmin_key.txt | grep -oP "Private key: \K[^\n]*")
PUB_KEY=$(cat /keys/tvgadmin_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet import --private-key $PRIV_KEY
cleos create account eosio tvgadmin $PUB_KEY >>/root/setup_error
cleos push action eosio.token transfer '[ "eosio", "tvgadmin", "1000.0000 EOS", "deposit" ]' -p eosio@active

// USER 1
PRIV_KEY=$(cat /keys/tvguser1_key.txt | grep -oP "Private key: \K[^\n]*")
PUB_KEY=$(cat /keys/tvguser1_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet import --private-key $PRIV_KEY
cleos create account eosio tvguser1 $PUB_KEY >>/root/setup_error
cleos push action eosio.token transfer '[ "eosio", "tvguser1", "1000.0000 EOS", "deposit" ]' -p eosio@active

// USER 2
PRIV_KEY=$(cat /keys/tvguser2_key.txt | grep -oP "Private key: \K[^\n]*")
PUB_KEY=$(cat /keys/tvguser2_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet import --private-key $PRIV_KEY
cleos create account eosio tvguser2 $PUB_KEY >>/root/setup_error
cleos push action eosio.token transfer '[ "eosio", "tvguser2", "1000.0000 EOS", "deposit" ]' -p eosio@active

// USER 3
PRIV_KEY=$(cat /keys/tvguser3_key.txt | grep -oP "Private key: \K[^\n]*")
PUB_KEY=$(cat /keys/tvguser3_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet import --private-key $PRIV_KEY
cleos create account eosio tvguser3 $PUB_KEY >>/root/setup_error
cleos push action eosio.token transfer '[ "eosio", "tvguser3", "1000.0000 EOS", "deposit" ]' -p eosio@active

// USER 4
PRIV_KEY=$(cat /keys/tvguser4_key.txt | grep -oP "Private key: \K[^\n]*")
PUB_KEY=$(cat /keys/tvguser4_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet import --private-key $PRIV_KEY
cleos create account eosio tvguser4 $PUB_KEY >>/root/setup_error
cleos push action eosio.token transfer '[ "eosio", "tvguser4", "1000.0000 EOS", "deposit" ]' -p eosio@active

// USER 5
PRIV_KEY=$(cat /keys/tvguser5_key.txt | grep -oP "Private key: \K[^\n]*")
PUB_KEY=$(cat /keys/tvguser5_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet import --private-key $PRIV_KEY
cleos create account eosio tvguser5 $PUB_KEY >>/root/setup_error
cleos push action eosio.token transfer '[ "eosio", "tvguser5", "1000.0000 EOS", "deposit" ]' -p eosio@active

// USER 11
PRIV_KEY=$(cat /keys/tvguser11_key.txt | grep -oP "Private key: \K[^\n]*")
PUB_KEY=$(cat /keys/tvguser11_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet import --private-key $PRIV_KEY
cleos create account eosio tvguser11 $PUB_KEY >>/root/setup_error
cleos push action eosio.token transfer '[ "eosio", "tvguser11", "1000.0000 EOS", "deposit" ]' -p eosio@active

// USER 12
PRIV_KEY=$(cat /keys/tvguser12_key.txt | grep -oP "Private key: \K[^\n]*")
PUB_KEY=$(cat /keys/tvguser12_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet import --private-key $PRIV_KEY
cleos create account eosio tvguser12 $PUB_KEY >>/root/setup_error
cleos push action eosio.token transfer '[ "eosio", "tvguser12", "1000.0000 EOS", "deposit" ]' -p eosio@active

// USER 13
PRIV_KEY=$(cat /keys/tvguser13_key.txt | grep -oP "Private key: \K[^\n]*")
PUB_KEY=$(cat /keys/tvguser13_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet import --private-key $PRIV_KEY
cleos create account eosio tvguser13 $PUB_KEY >>/root/setup_error
cleos push action eosio.token transfer '[ "eosio", "tvguser13", "1000.0000 EOS", "deposit" ]' -p eosio@active

// USER 14
PRIV_KEY=$(cat /keys/tvguser14_key.txt | grep -oP "Private key: \K[^\n]*")
PUB_KEY=$(cat /keys/tvguser14_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet import --private-key $PRIV_KEY
cleos create account eosio tvguser14 $PUB_KEY >>/root/setup_error
cleos push action eosio.token transfer '[ "eosio", "tvguser14", "1000.0000 EOS", "deposit" ]' -p eosio@active

sleep 1s

// NFTS
cleos push action mebtradingvg create '[ "tvguser1", "tvguser1","{\"title\":\"Doppia dormita nella paglia\",\"url\":\"nft-1000001.jpg\"}"]' -p tvguser1@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser1", "tvguser2","{\"title\":\"Cowgirl appisolata\",\"url\":\"nft-1000002.jpg\"}"]' -p tvguser1@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser1", "tvguser1","{\"title\":\"Mastro geppetto su paglia\",\"url\":\"nft-1000003.jpg\"}"]' -p tvguser1@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser1", "tvguser11","{\"title\":\"Cavallo in stalla\",\"url\":\"nft-1000004.jpg\"}"]' -p tvguser1@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser1", "tvguser11","{\"title\":\"Ragazza beata\",\"url\":\"nft-1000005.jpg\"}"]' -p tvguser1@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser1", "tvguser1","{\"title\":\"Gattino dorme\",\"url\":\"nft-1000006.jpg\"}"]' -p tvguser1@active -p mebtradingvg@active

cleos push action mebtradingvg create '[ "tvguser3", "tvguser11","{\"title\":\"Bicchieri matti\",\"url\":\"nft-1000007.jpg\"}"]' -p tvguser3@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser3", "tvguser3","{\"title\":\"Raggi matti\",\"url\":\"nft-1000008.jpg\"}"]' -p tvguser3@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser3", "tvguser3","{\"title\":\"Auto in cerchio\",\"url\":\"nft-1000009.jpg\"}"]' -p tvguser3@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser3", "tvguser2","{\"title\":\"Maglia metallo\",\"url\":\"nft-1000010.jpg\"}"]' -p tvguser3@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser3", "tvguser11","{\"title\":\"Hangover\",\"url\":\"nft-1000011.jpg\"}"]' -p tvguser3@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser3", "tvguser2","{\"title\":\"Hangover v2\",\"url\":\"nft-1000012.jpg\"}"]' -p tvguser3@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser3", "tvguser12","{\"title\":\"Foresta sfuocata\",\"url\":\"nft-1000013.jpg\"}"]' -p tvguser3@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser3", "tvguser3","{\"title\":\"GTA\",\"url\":\"nft-1000014.jpg\"}"]' -p tvguser3@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser3", "tvguser3","{\"title\":\"Ragnatela\",\"url\":\"nft-1000015.jpg\"}"]' -p tvguser3@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser3", "tvguser3","{\"title\":\"Porto illuminato\",\"url\":\"nft-1000016.jpg\"}"]' -p tvguser3@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser3", "tvguser11","{\"title\":\"Bianco nero qualcosa\",\"url\":\"nft-1000017.jpg\"}"]' -p tvguser3@active -p mebtradingvg@active

cleos push action mebtradingvg create '[ "tvguser4", "tvguser12","{\"title\":\"Psicadelico\",\"url\":\"nft-1000018.jpg\"}"]' -p tvguser4@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser4", "tvguser4","{\"title\":\"Astrattissimo\",\"url\":\"nft-1000019.jpg\"}"]' -p tvguser4@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser4", "tvguser2","{\"title\":\"Astratto e psicadelico\",\"url\":\"nft-1000020.jpg\"}"]' -p tvguser4@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser4", "tvguser4","{\"title\":\"Schizzi a caso\",\"url\":\"nft-1000021.jpg\"}"]' -p tvguser4@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser4", "tvguser4","{\"title\":\"Macchie a caso\",\"url\":\"nft-1000022.jpg\"}"]' -p tvguser4@active -p mebtradingvg@active

cleos push action mebtradingvg create '[ "tvguser5", "tvguser5","{\"title\":\"Fearless\",\"url\":\"nft-1000023.jpg\"}"]' -p tvguser5@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser5", "tvguser2","{\"title\":\"Valhalla\",\"url\":\"nft-1000024.jpg\"}"]' -p tvguser5@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser5", "tvguser5","{\"title\":\"A Colourful Friendship\",\"url\":\"nft-1000025.jpg\"}"]' -p tvguser5@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser5", "tvguser12","{\"title\":\"Butterfly and pink flowers\",\"url\":\"nft-1000026.jpg\"}"]' -p tvguser5@active -p mebtradingvg@active

cleos push action mebtradingvg create '[ "tvguser14", "tvguser14","{\"title\":\"Mare\",\"url\":\"nft-1000027.jpg\"}"]' -p tvguser14@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser14", "tvguser11","{\"title\":\"Cascata\",\"url\":\"nft-1000028.jpg\"}"]' -p tvguser14@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser14", "tvguser14","{\"title\":\"Laghetto\",\"url\":\"nft-1000029.jpg\"}"]' -p tvguser14@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser14", "tvguser12","{\"title\":\"Caraibi e nuvole brutte\",\"url\":\"nft-1000030.jpg\"}"]' -p tvguser14@active -p mebtradingvg@active

cleos push action mebtradingvg create '[ "tvguser12", "tvguser12","{\"title\":\"Tohoku Itako Limited\",\"url\":\"nft-1000031.png\"}"]' -p tvguser12@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser12", "tvguser12","{\"title\":\"Chugoku Usagi Limited\",\"url\":\"nft-1000032.png\"}"]' -p tvguser12@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser12", "tvguser12","{\"title\":\"Zunko Tohoku Limited\",\"url\":\"nft-1000033.png\"}"]' -p tvguser12@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser12", "tvguser12","{\"title\":\"Tohoku Kiritan Limited\",\"url\":\"nft-1000034.png\"}"]' -p tvguser12@active -p mebtradingvg@active

cleos push action mebtradingvg create '[ "tvguser13", "tvguser13","{\"title\":\"Pappagallo\",\"url\":\"nft-1000035.png\"}"]' -p tvguser13@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser13", "tvguser2","{\"title\":\"Pappagallo in volo\",\"url\":\"nft-1000036.png\"}"]' -p tvguser13@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser13", "tvguser13","{\"title\":\"Pappagallo atterra\",\"url\":\"nft-1000037.png\"}"]' -p tvguser13@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser13", "tvguser12","{\"title\":\"Pappagallo parte\",\"url\":\"nft-1000038.png\"}"]' -p tvguser13@active -p mebtradingvg@active
cleos push action mebtradingvg create '[ "tvguser13", "tvguser13","{\"title\":\"Pappagallo guarda brutto\",\"url\":\"nft-1000039.png\"}"]' -p tvguser13@active -p mebtradingvg@active
