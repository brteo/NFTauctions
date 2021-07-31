if [ ! -f /keys/tvgadmin_key.txt ]; then
	cleos create key -f /keys/tvgadmin_key.txt
fi
if [ ! -f /keys/tvguser1_key.txt ]; then
	cleos create key -f /keys/tvguser1_key.txt
fi
if [ ! -f /keys/tvguser2_key.txt ]; then
	cleos create key -f /keys/tvguser2_key.txt
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
cleos push action mebtradingvg create '[ "tvguser1", "tvguser1","{\"title\":\"Dormita nella paglia\",\"url\":\"https://scontent-mxp1-1.xx.fbcdn.net/v/t1.6435-9/70062842_2515386555190263_4887841880005410816_n.jpg?_nc_cat=107&_nc_rgb565=1&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=BvYEkYDT7TwAX-WY7v2&_nc_ht=scontent-mxp1-1.xx&oh=426fc3ec7436c2331197c604348d88bd&oe=60F6E358\"}"]' -p tvguser1@active -p mebtradingvg@active

// USER 2
PRIV_KEY=$(cat /keys/tvguser2_key.txt | grep -oP "Private key: \K[^\n]*")
PUB_KEY=$(cat /keys/tvguser2_key.txt | grep -oP "Public key: \K[^\n]*")
cleos wallet import --private-key $PRIV_KEY
cleos create account eosio tvguser2 $PUB_KEY >>/root/setup_error
cleos push action eosio.token transfer '[ "eosio", "tvguser2", "1000.0000 EOS", "deposit" ]' -p eosio@active
cleos push action mebtradingvg create '[ "tvguser1", "tvguser2","{\"title\":\"Porsche\",\"url\":\"https://i2.res.24o.it/images2010/Editrice/ILSOLE24ORE/ILSOLE24ORE/2019/09/04/Motori24/ImmaginiWeb/Ritagli/IMG-20190904-WA0032-kGo--1020x533@IlSole24Ore-Web.jpg?r=650x341\"}"]' -p tvguser1@active -p mebtradingvg@active
