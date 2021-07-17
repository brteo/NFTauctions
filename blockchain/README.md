# BLOCKCHAIN

Version Eosio 2.1 + CDT 1.8.0

Eosio API endpoint [http://localhost:8888](http://localhost:8888)

## MANAGE

On container start the blockchain will be initialized and started.

#### CHECK STATUS

```bash
tail -f blockchain/logs/nodeos.log
```

You should see a new produced block every 0.5 seconds like this

```
info  2021-07-14T07:51:44.901 nodeos    producer_plugin.cpp:2333      produce_block        ] Produced block 2364cbb25d04ee7e... #2514 @ 2021-07-14T07:51:45.000 signed by eosio [trxs: 0, lib: 2513, confirmed: 0]
```

#### BLOCKCHAIN DAEMON

```bash
./nodeos.sh # start / restart
./nodeos.sh stop # stop
./nodeos.sh replay # replay blocks to restore the state
./nodeos.sh reset # remove all data and restart
```

To manually delete all data: stop the container and empty `data`, `keys` and `logs` folders

#### CLEOS

Launch cleos commands - wallet already unlocked

```bash
./cleos.sh arg1 arg2 ...
```

Check [cleos command list](https://developers.eos.io/manuals/eos/latest/cleos/command-reference/index)

#### CONTAINER SHELL

Log in container shell with preloaded keys as env variables and unlocked wallet

```bash
docker exec -it blockchain bash -c "source /root/env.sh;bash"
```

<br />

## BUILD AND DEPLOY

`CTRL` + `SHIFT` + `B` to build and deploy the **default** contract. <br/>
Default contract and account are set in `.env` file to `tvg` and `mebtradingvg`.
Reset the blockchain to apply changes to account or contract name.

<br />

## KEYS & ACCOUNTS

Preconfigured accounts on first installation:

- eosio
- eosio.token
- eosio.msig
- mebtradingvg

Check folder `wallet` for `wallet password` and check folder `keys` for `public & private` keys to use with mebtradingvg and eosio.\* accounts.<br />
Do **NOT** change or remove `key.txt`: this key is also set as `EOS_KEY` var in `api/.env` file.

<br />

## LINKS

- https://github.com/EOSIO/eosio.cdt - cdt api & examples
- https://developers.eos.io/welcome/latest/tutorials/bios-boot-sequence - general blockchain setup
- https://github.com/EOSIO/return-values-example-app - action return value
- https://github.com/EOSIO/eos/issues/4407 - multi signature

# TODO

- Integrazione wallet per fare login oppure login e poi collegamento al wallet
- trasferimento diretto -> TOGLIERE!
- se è una prima vendita: una 20% va alla struttura, e il resto all'artista/venditore
- se è una seconda vendita: 10% all'artista, e 3% alla struttura e il resto al venditore
- creazione NFT
- aste <- prezzo di partenza, asta con scadenza + puntate + riserva di prezzo -> raggiunta una certa soglia il primo che la raggiunge se lo aggiudica
- prezzo fisso
- offerta che parte da un acquirente
