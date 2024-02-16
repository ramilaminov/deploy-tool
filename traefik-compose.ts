export const traefikCompose = ({
  domain,
  letsEncryptEmail,
}: {
  domain: string;
  letsEncryptEmail: string;
}) => `
version: '3.8'

services:
  traefik:
    image: traefik:v3.0
    command:
      - --log
      - --log.level=DEBUG
      - --accesslog # debug
      - --providers.docker=true
      - --providers.swarm.endpoint=unix:///var/run/docker.sock
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.letsencrypt.acme.email=${letsEncryptEmail}
      - --certificatesresolvers.letsencrypt.acme.storage=/certificates/acme.json
      - --certificatesresolvers.letsencrypt.acme.tlschallenge=true
    ports:
      - 80:80
      - 443:443
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik-public-certificates:/certificates
    deploy:
      placement:
        constraints:
          - node.role == manager
      labels:
        - traefik.enable=false
        - traefik.docker.network=traefik-public
        - traefik.http.middlewares.https-redirect.redirectscheme.scheme=https
        - traefik.http.middlewares.https-redirect.redirectscheme.permanent=true
        - traefik.http.routers.traefik-public-http.rule=Host(\`${domain}\`)
        - traefik.http.routers.traefik-public-http.entrypoints=web
        - traefik.http.routers.traefik-public-http.middlewares=https-redirect
    networks:
      - traefik-public

volumes:
  traefik-public-certificates:

networks:
  traefik-public:
    external: true
`;
