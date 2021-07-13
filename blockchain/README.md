cleos set contract ACCOUNT "contract"

struct NFT {owner,url}
TABELLA NFTs

cleos push action ACCOUNT crea_NFT {author,owner,url}

cleos push action ACCOUNT transfer_NFT {owner,to_new_owner}

event eosio.token ontransfer {from,ACCOUNT,qty,{astaID}}

# TODO

- Integrazione wallet per fare login oppure login e poi collegamento al wallet
- se è una prima vendita: una 20% va alla struttura, e il resto all'artista/venditore
- se è una seconda vendita: 10% all'artista, e 3% alla struttura e il resto al venditore
- creazione NFT
- trasferimento privato -> NO!
- aste <- prezzo di partenza, asta con scadenza + puntate + riserva di prezzo -> raggiunta una certa soglia il primo che la raggiunge se lo aggiudica
- prezzo fisso
- offerta che parte da un acquirente
