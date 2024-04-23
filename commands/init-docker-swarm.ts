import { $ } from "bun";
import type { SSHRunner } from "../utils/ssh";

export async function initDockerSwarm(ssh: SSHRunner, { ip }: { ip: string }) {
  console.log("Setting Docker to Swarm mode...");

  await ssh(
    `sudo docker swarm init --advertise-addr ${$.escape(ip)} > /dev/null`,
  );

  console.log("Docker swarm mode activated successfully.");
}
