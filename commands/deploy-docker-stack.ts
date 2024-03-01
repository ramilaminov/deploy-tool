import { $ } from "bun";
import type { SSHRunner } from "../utils/ssh";

export async function deployDockerStack(
  ssh: SSHRunner,
  { compose, name }: { compose: string; name: string },
) {
  console.log(`Deploying '${name}' stack...`);

  await ssh(
    `echo ${$.escape(compose)} | sudo docker stack deploy -c - ${name} > /dev/null`,
  );

  console.log(`Stack '${name}' started successfully.`);
}
