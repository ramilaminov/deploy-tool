import YAML from "yaml";

export const traefikCompose = () =>
  YAML.stringify({
    version: "3.8",
    services: {
      traefik: {
        image: "traefik:v3.0",
        command: [
          "--log",
          "--log.level=DEBUG", // Only for debug
          "--accesslog", // Only for debug
          "--providers.docker=true",
          "--providers.swarm.endpoint=unix:///var/run/docker.sock",
          "--providers.docker.exposedbydefault=false",
          "--entrypoints.web.address=:80",
          "--entrypoints.web.http.redirections.entryPoint.to=websecure",
          "--entrypoints.web.http.redirections.entryPoint.scheme=https",
          "--entrypoints.websecure.address=:443",
          "--entrypoints.websecure.http.tls.certResolver=letsencrypt",
          "--certificatesresolvers.letsencrypt.acme.storage=/certificates/acme.json",
          "--certificatesresolvers.letsencrypt.acme.tlschallenge=true",
        ],
        ports: ["80:80", "443:443"],
        volumes: [
          "/var/run/docker.sock:/var/run/docker.sock:ro",
          "traefik-certificates:/certificates",
        ],
        deploy: {
          placement: {
            constraints: ["node.role == manager"],
          },
          labels: {
            "traefik.enable": false,
            "traefik.docker.network": "traefik-public",
          },
        },
        networks: ["traefik-public"],
      },
    },
    volumes: {
      "traefik-certificates": {},
    },
    networks: {
      "traefik-public": {
        external: true,
      },
    },
  });
