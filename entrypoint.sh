#!/bin/bash

/usr/local/bin/bitcoind -datadir=/bitcoin -conf=/bitcoin/bitcoin.conf -daemon
echo Docker is shit
python3 /pysoxy.py

