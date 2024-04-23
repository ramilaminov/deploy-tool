import { $ } from "bun";
import type { SSHRunner } from "../utils/ssh";
import {
  type DockerRegistry,
  logInToDockerRegistry,
} from "./log-in-to-docker-registry";

export async function deployDockerStack(
  ssh: SSHRunner,
  {
    compose,
    name,
    registry,
  }: { compose: string; name: string; registry?: DockerRegistry },
) {
  console.log(`Deploying '${name}' stack...`);

  if (registry) {
    await logInToDockerRegistry(ssh, registry);
  }

  await ssh(
    `echo ${$.escape(
      compose,
    )} | sudo docker stack deploy -c - ${name} > /dev/null`,
  );

  console.log(`Stack '${name}' started successfully.`);
}
