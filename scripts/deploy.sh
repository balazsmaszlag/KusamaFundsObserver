#!/bin/bash
set -e

SCRIPT_DIR=${PWD}
echo $SCRIPT_DIR
CLUSTER_NAME="web3"

if ! [ "$#" -eq  "0" ]
   then
    CLUSTER_NAME=$1
fi

if ! [ -f ../kusamaObserver/env-config.json ]; then
  echo "env-config.json does not exist. Use kusamaObserver/env-config.json as example to generate it." >&2
  exit 1
fi

if ! [ -x "$(command -v docker)" ]; then
  echo 'Error: docker is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v kubectl)" ]; then
  echo 'Error: kubectl is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v kind)" ]; then
  echo 'Error: kind is not installed.' >&2
  exit 1
fi

cd ../kusamaObserver && docker compose build && cd $SCRIPT_DIR

if [ -z $(kind get clusters | grep "^$CLUSTER_NAME$") ]; then
  kind create cluster --name $CLUSTER_NAME --config kind-cluster.yaml
fi

kind --name web3 load docker-image kusama_observer:v0.0.1
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
cd ../helm && helm install kusama-observer-chart kusama-observer/ --values kusama-observer/values.yaml && cd $SCRIPT_DIR

helm install -f ../helm/prometheus-config.yaml prometherus-stack prometheus-community/kube-prometheus-stack
