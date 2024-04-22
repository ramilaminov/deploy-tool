import { serviceCompose } from "../templates/service-compose";
import type { SSHRunner } from "../utils/ssh";
import { deployDockerStack } from "./deploy-docker-stack";
import type { DockerRegistry } from "./log-in-to-docker-registry";

export async function deploy(
  ssh: SSHRunner,
  {
    domain,
    image,
    name,
    port,
    path,
    environment,
    registry,
  }: {
    domain: string;
    image: string;
    name: string;
    port: string;
    path?: string;
    environment: string[];
    registry: DockerRegistry;
  },
) {
  console.log(`Deploying a new version of service '${name}'...`);

  await deployDockerStack(ssh, {
    compose: serviceCompose({ name, image, port, domain, path, environment }),
    name,
    registry,
  });

  console.log(`\nService '${name}' will be available at https://${domain}.`);
  console.log("Generating certificates may take a few more minutes.");
}
