#!/bin/bash
set -e

CLUSTER_NAME="web3"

if ! [ "$#" -eq  "0" ]
   then
    CLUSTER_NAME=$1
fi

kind delete cluster --name $CLUSTER_NAME