import { serviceCompose } from "../templates/service-compose";
import type { SSHRunner } from "../utils/ssh";
import { deployStack } from "./deploy-stack";

export async function deploy(
  ssh: SSHRunner,
  {
    domain,
    image,
    name,
    port,
  }: {
    domain: string;
    image: string;
    name: string;
    port: string;
  },
) {
  console.log(`Deploying a new version of service '${name}'...`);

  await deployStack(ssh, {
    compose: serviceCompose({ name, image, port, domain }),
    name,
  });

  console.log(`\nService '${name}' will be available at https://${domain}.`);
  console.log("Generating certificates may take a few more minutes.");
}
