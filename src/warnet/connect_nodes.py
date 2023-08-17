import logging
import docker
import networkx as nx

from .rpc_utils import addnode
from .docker_utils import get_container_ip, get_containers


logging.basicConfig(level=logging.INFO)

def load_ip_mapping(filename):
    """
    Load the IP mapping from a file into a dictionary.

    :param filename: The name of the file containing the IP mapping
    :return: A dictionary mapping real IP addresses to fake IP addresses
    """
    ip_mapping = {}
    with open(filename, 'r') as file:
        for line in file:
            fake_ip, real_ip = line.strip().split(', ')
            ip_mapping[real_ip] = fake_ip
            ip_mapping[fake_ip] = real_ip
    return ip_mapping


def connect_edges(client: docker.DockerClient, graph_file: str):
    """
    Setup and add nodes to the network.

    :param graph_file: The path to the graph file
    """
    ip_mapping = load_ip_mapping('ip_mapping.dat')
    try:
        graph = nx.read_graphml(graph_file, node_type=int)
        logging.info(get_containers(client))
        # import pdb; pdb.set_trace()
        for edge in graph.edges():
            source = f"warnet_{str(edge[0])}"
            dest = f"warnet_{str(edge[1])}"
            source_container = client.containers.get(source)
            logging.info(f"Connecting node {source} to {dest}")
            addnode(source_container, get_container_ip(client, dest, ip_mapping))
    except Exception as e:
        logging.error(f"An error occurred while setting up the network: {e}")

