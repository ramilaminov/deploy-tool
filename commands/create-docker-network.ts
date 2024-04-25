import { $ } from "bun";
import type { SSHRunner } from "../utils/ssh";

export async function createDockerNetwork(
  ssh: SSHRunner,
  { name }: { name: string },
) {
  // TODO Check if network is already installed first

  console.log(`Creating Docker network named '${name}'...`);

  await ssh(
    `sudo docker network create --driver=overlay ${$.escape(name)} >/dev/null`,
  );

  console.log(`Network '${name}' created successfully.`);
}
