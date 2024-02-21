export const serviceCompose = ({
  name,
  image,
  port,
  domain,
}: {
  name: string;
  image: string;
  port: string;
  domain: string;
}) => `
version: '3.8'

services:
  ${name}:
    image: ${image}
    deploy:
      replicas: 1
      update_config:
        parallelism: 1
        failure_action: rollback
        delay: 10s
        order: start-first
      rollback_config:
        parallelism: 0
        order: stop-first
      restart_policy:
        condition: any
        delay: 5s
        max_attempts: 3
        window: 120s
      labels:
        - traefik.enable=true
        - traefik.http.services.${name}.loadbalancer.server.port=${port}
        - traefik.http.routers.${name}.rule=Host(\`${domain}\`)
        - traefik.http.routers.${name}.entrypoints=websecure
    networks:
      - traefik-public

networks:
  traefik-public:
    external: true
`;
