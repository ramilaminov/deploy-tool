import type { SSHRunner } from "../utils/ssh";

export async function createDockerNetwork(
  ssh: SSHRunner,
  { name }: { name: string },
) {
  console.log(`Creating Docker network named '${name}'...`);

  await ssh(`sudo docker network create --driver=overlay ${name}`);

  console.log(`'${name}' network created.`);
}
