# Kusama network observer

Observing the kusama network https://kusama.network/ and the tooling for deploying it on a Kubernetes platform. The system monitors a list of given accounts and sends an alert if an account runs out of funds (under a configurable threshold).

## Environments

To run and deploy the application you need the following tools

- Docker
- docker compose
- kubectl
- helm

optionally:

- npm
- node

## Run the observer application locally

### workdir: ./kusamaNetwork

First, you need to create a copy of env-config.json.sample -> env-config.json and fill it in as many accounts as you want.
Then execute this command:

docker compose up --build

By default, the service will be exposed on the 5001 port (you can modify it inside .env file). You can check the metrics here:

http://localhost:5001/metrics

## Helm

A helm chart was created for installing the Kusama network observer

## Deploy everything to a local kind kuberntetes cluster (State: under development)

First, you need to create a copy of env-config.json.sample -> env-config.json and fill it in as many accounts as you want.

Then you can execute the ./scripts/deploy.sh which should deploy the whole setup in a local environment.

As a parameter of the deploy script, you can give the cluster name if you want (the default is web3).
