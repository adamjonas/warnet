FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    ccache \
    python3 \
    vim \
    fish \
    iproute2 \
    build-essential \
    wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ARG ARCH
ARG BITCOIN_URL
ARG BITCOIN_VERSION

RUN wget $BITCOIN_URL && \
    tar -xzf bitcoin-${BITCOIN_VERSION}-${ARCH}-linux-gnu.tar.gz -C /usr/local --strip-components=1

COPY pysoxy.py /pysoxy.py
RUN chmod +x /pysoxy.py

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN mkdir /bitcoin
WORKDIR /bitcoin
COPY config/bitcoin.conf .

CMD ["/entrypoint.sh"]
