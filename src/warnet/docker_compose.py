import yaml
import subprocess
import logging
import networkx as nx
from .prometheus import generate_prometheus_config
from .ip_addr import generate_ip_addresses

logging.basicConfig(level=logging.INFO)

def get_architecture():
    """
    Get the architecture of the machine.

    :return: The architecture of the machine or None if an error occurred
    """
    try:
        result = subprocess.run(['uname', '-m'], stdout=subprocess.PIPE)
        architecture = result.stdout.decode('utf-8').strip()
        if architecture == "arm64":
            architecture = "aarch64"
        return architecture
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return None


def generate_docker_compose(graph_file: str):
    """
    Generate a docker-compose.yml file for the given graph.

    :param version: A list of Bitcoin Core versions
    :param node_count: The number of nodes in the graph
    """
    arch = get_architecture()
    if arch is not None:
        logging.info(f"Detected architecture: {arch}")
    else:
        raise Exception("Failed to detect architecture.")

    graph = nx.read_graphml(graph_file, node_type=int)
    nodes = graph.nodes()
    addr_pairs = generate_ip_addresses(len(nodes))
    generate_prometheus_config(len(nodes))

    # Networks configuration
    networks = {}
    for i in range(len(nodes)):
        network_name = f"warnet_network_{i}"
        subnet, _ = addr_pairs[i]
        networks[network_name] = {
            "driver": "bridge",
            "ipam": {
                "config": [
                    {
                        "subnet": subnet
                    }
                ]
            }
        }

    services = {}
    volumes = {
        "grafana-storage": None,
    }

    for i in range(len(nodes)):
        version = nodes[i]["version"]
        _, ip = addr_pairs[i]
        network_name = f"warnet_network_{i}"

        services[f"bitcoin-node-{i}"] = {
            "container_name": f"warnet_{i}",
            "build": {
                "context": ".",
                "dockerfile": "Dockerfile",
                "args": {
                    "ARCH": arch,
                    "BITCOIN_VERSION": version,
                    "BITCOIN_URL": f"https://bitcoincore.org/bin/bitcoin-core-{version}/bitcoin-{version}-{arch}-linux-gnu.tar.gz"
                }
            },
            "volumes": [
                f"./config/bitcoin.conf:/root/.bitcoin/bitcoin.conf"
            ],
            "networks": {
                network_name: {
                    "ipv4_address": ip
                }
            }
        }

    compose_config = {
        "version": "3.8",
        "services": services,
        "volumes": volumes,
        "networks": networks
    }

    try:
        with open("docker-compose.yml", "w") as file:
            yaml.dump(compose_config, file)
    except Exception as e:
        logging.error(f"An error occurred while writing to docker-compose.yml: {e}")

