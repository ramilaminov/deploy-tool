import type { SSHRunner } from "../utils/ssh";

export async function installDocker(ssh: SSHRunner) {
  // TODO Check if docker is already installed first

  console.log("Installing Docker...");

  await ssh("curl -fsSL https://get.docker.com | sh");

  console.log("Docker installed successfully.");
}
