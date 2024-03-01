import { traefikCompose } from "../templates/traefik-compose";
import type { SSHRunner } from "../utils/ssh";
import { createDockerNetwork } from "./create-docker-network";
import { deployDockerStack } from "./deploy-docker-stack";
import { initDockerSwarm } from "./init-docker-swarm";
import { installDocker } from "./install-docker";

export async function setup(ssh: SSHRunner, { ip }: { ip: string }) {
  console.log(`Configuring the server at ${ip}...`);

  console.log("\nSTEP 1/4");
  await installDocker(ssh);

  console.log("\nSTEP 2/4");
  await initDockerSwarm(ssh, { ip });

  console.log("\nSTEP 3/4");
  await createDockerNetwork(ssh, { name: "traefik-public" });

  console.log("\nSTEP 4/4");
  await deployDockerStack(ssh, { compose: traefikCompose(), name: "traefik" });

  console.log(`\nServer at ${ip} configured.`);
}
