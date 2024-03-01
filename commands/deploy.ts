import { serviceCompose } from "../templates/service-compose";
import type { SSHRunner } from "../utils/ssh";
import { deployDockerStack } from "./deploy-docker-stack";

export async function deploy(
  ssh: SSHRunner,
  {
    domain,
    image,
    name,
    port,
    path,
  }: {
    domain: string;
    image: string;
    name: string;
    port: string;
    path?: string;
  },
) {
  console.log(`Deploying a new version of service '${name}'...`);

  await deployDockerStack(ssh, {
    compose: serviceCompose({ name, image, port, domain, path }),
    name,
  });

  console.log(`\nService '${name}' will be available at https://${domain}.`);
  console.log("Generating certificates may take a few more minutes.");
}
