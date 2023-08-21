from typing import List, Dict, Optional, Union
from dataclasses import dataclass

@dataclass
class DockerComposeService:
    name: str
    container_name: str
    image: Optional[str] = None
    build: Optional[Dict[str, Union[str, Dict[str, str]]]] = None
    volumes: Optional[List[str]] = None
    command: Optional[List[str]] = None
    networks: Optional[Union[List[str], Dict[str, Union[List[str], Dict[str, str]]]]] = None
    environment: Optional[Dict[str, Union[str, int]]] = None
    ports: Optional[List[str]] = None

    def dump(self) -> Dict[str, Dict]:
        attributes = {
            "container_name": self.container_name,
            "image": self.image,
            "build": self.build,
            "volumes": self.volumes,
            "command": self.command,
            "networks": self.networks,
            "environment": self.environment,
            "ports": self.ports
        }
 
        # Filter out attributes with None values
        filtered_attributes = {k: v for k, v in attributes.items() if v is not None}

        service_data = {self.name: filtered_attributes}
        return service_data


class DockerComposeServicesDict(dict):
    def add_service(
            self,
            name: str,
            container_name: str,
            image: Optional[str] = None,
            build: Optional[Dict[str, Union[str, Dict[str, str]]]] = None,
            volumes: Optional[List[str]] = None,
            command: Optional[List[str]] = None,
            networks: Optional[Union[List[str], Dict[str, Union[List[str], Dict[str, str]]]]] = None,
            environment: Optional[Dict[str, Union[str, int]]] = None,
            ports: Optional[List[str]] = None):

        service = DockerComposeService(name, container_name, image, build, volumes, command, networks, environment, ports)
        self[name] = service.dump()[name]
