# TradingVG

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

1. Install api npm package on "api" folder

   ```sh
   npm i
   ```

2. Install api npm package on "web" folder

   ```sh
   npm i --legacy-peer-deps
   ```

3. Launch docker in the "main" folder

   ```sh
   docker compose up -d
   ```

4. Seed Mongo DB in api folder

   ```sh
   npm run seed
   ```

## Seed reset

To reset seed data

1. Seed Mongo DB in api folder

   ```sh
   npm run seed
   ```

2. Launch reset in the "blockchain" folder

   ```sh
   ./nodeos.sh reset
   ```

`Important`
If you had logged in with user in FrontEnd and run seed you'll get a authReset error... run again seed

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

## Localstack

- [Git](https://github.com/localstack/localstack)
- [Learn How to Run AWS on Your Local Machine With LocalStack](https://betterprogramming.pub/-dont-be-intimidated-learn-how-to-run-aws-on-your-local-machine-with-localstack-2f3448462254)
- [Docker-localstack-tutorial](https://dev.to/goodidea/how-to-fake-aws-locally-with-localstack-27me)

Starting with releases after v0.11.5, all services are now exposed via the edge service (port 4566) only! Please update your client configurations to use this new endpoint.

- Health [http://localhost:4566/health](http://localhost:4566/)

- WEB UI DEPRECATED -> PORT_WEB_UI: Port for the Web user interface / dashboard (default: 8080 mapped on 8055 on docker).
  Note that the Web UI is now deprecated (needs to be activated with START_WEB=1), and requires to use the localstack/localstack-full Docker image.

## LaTeX

- [install](https://www.latex-project.org/get/)
- [vscode](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop)
- [learn latex in 30 minutes](https://it.overleaf.com/learn/latex/Learn_LaTeX_in_30_minutes)
