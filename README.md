# NFTauctions

Realizzazione di un portale web per le aste in tempo reale su NFT (Non-Fungible Token) per lo scambio di proprietà digitali.

Stack MERN (Mongo-Express-React-Node) con Docker Compose:

- BackEnd: REST Api sviluppata in Node+Express collegata con il database MongoDB
- FrontEnd: Single Page Application in React

### Specifiche funzionali:

- Registrazione utenti
- Login utenti con autorizzazione JWT + RefreshToken
- Gestione di diversi ruoli utente tramite RBAC (Role Base Access Control)
- Profilo utente con possibilità di definire il wallet per lo scambio di NFT
- Possibilità di creare un’asta:
- Titolo, descrizione, categoria, tags, immagine
- Sarà creato un NFT collegato all’immagine inserita utilizzando l’API di [EOS](https://developers.eos.io)
- Pagina con la lista delle aste in corso con possibilità di ricerca e filtri
- Pagina dell’asta con dettagli e possibilità di partecipare con delle proposte. La gestione del prezzo dell’asta sarà in real-time utilizzando Web Socket e si presterà particolare attenzione al salvataggio di dati su MongoDB al fine di non avere problemi di - concorrenza.
- Una volta conclusa l’asta arriverà una email al vincitore con un link per il pagamento. (il pagamento sarà solo emulato e non sarà integrato nessun servizio esterno come PayPal o Stripe). Cliccando verrà eseguita la transazione sulla blockchain per lo scambio - del NFT

Caratteristiche aggiuntive tempo permettendo:

- Pannello di controllo per monitorare le aste e tutti gli utenti registrati
- Trasformare la Single Page Application in Progressive Web App per abilitare le Push Notification su browser per avvisare l’utente quando avviene una puntata sull’asta che segue.

## Install

1. install api npm package on "api" folder

```sh
npm i
```

2. install api npm package on "web" folder

```sh
npm i --legacy-peer-deps
```

3. lunch docker in the "main" folder

```sh
docker compose up -d
```

## Docker commands

```sh
docker compose up -d #start like daemon
```

```sh
docker compose down -v #down
```

```sh
docker compose logs -f # follow the logs
```

```sh
docker ps -a #locate the name or ID of the containers
docker rm [CONTAINER] #remove container (also with first 2 chars of container ID)
```

```sh
docker system prune -a
#Purging All Unused or Dangling Images, Containers and Networks
# --volumes	  to remove volumes
# -f          Do not prompt for confirmation
```

```sh
docker volume ls #List of volumes
docker volume prune #remove all volumes
```

```sh
docker images -a #List of images
docker rmi $(docker images -a -q) #Remove all images
```
