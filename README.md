# NFTauctions

Web application for real-time auctions on NFT (Non-Fungible Token) to exchange digital properties.

Stack MERN with Docker Compose:

- BackEnd: RESTApi with MongoDB
- FrontEnd: React Single Page Application

### Functional specifications

- User registration
- User login with `JWT` + `RefreshToken` authorization
- Management of different user roles via `RBAC` (Role Base Access Control)
- User profile with the possibility to define the wallet for the NFT exchange
- Auction creation:
  - Fields: `Title`, `description`, `category`, `tags`, `image`
  - An NFT linked to the inserted image will be created using the [EOS Api](https://developers.eos.io)
- Page with the list of auctions in progress with the possibility of searching and filters
- Auction page with details and the possibility to participate with proposals. The auction price will be managed in real-time using Web Socket and particular attention will be paid to saving data on MongoDB in order to avoid competition problems.
- Once the auction has ended, the winner will receive an email with a payment link. (the payment will only be emulated and no external services such as PayPal or Stripe will be integrated). Clicking will execute the transaction on the blockchain for the exchange of the NFT

### Additional features:

- Control panel to monitor auctions and all registered users
- Transforming the Single Page Application into Progressive Web App to enable Push Notification on the browser to notify the user when a bid on the following auction takes place.

---

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

## VScode

Open the workspace in the folder roots

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
