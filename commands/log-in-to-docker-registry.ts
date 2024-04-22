import { $ } from "bun";
import type { SSHRunner } from "../utils/ssh";

export type DockerRegistry = {
  server?: string;
  username?: string;
  password?: string;
};

export async function logInToDockerRegistry(
  ssh: SSHRunner,
  registry: DockerRegistry,
) {
  console.log("Logging in to Docker registry...");

  const { server, username, password } = registry;

  let command = "sudo docker login";

  if (username !== undefined) {
    command = `${command} --username ${username}`;
  }

  if (password !== undefined) {
    command = `echo ${$.escape(password)} | ${command} --password-stdin`;
  }

  if (server !== undefined) {
    command = `${command} ${server}`;
  }

  await ssh(command);

  console.log("Logged in to Docker registry successfully.");
}
