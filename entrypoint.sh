#!/bin/bash

/usr/local/bin/bitcoind -datadir=/bitcoin -conf=/bitcoin/bitcoin.conf -daemon
python3 /pysoxy.py

