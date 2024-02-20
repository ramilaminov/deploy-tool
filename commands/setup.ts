import { $ } from "bun";
import { traefikCompose } from "../templates/traefik-compose";

export async function setup({ ip, sshUser }: { ip: string; sshUser: string }) {
  $.throws(true);

  const destination = `${sshUser}@${ip}`;

  // TODO Check if docker is already installed first

  console.log("1/5 Installing Docker...");
  await $`ssh "${destination}" "curl -fsSL https://get.docker.com | sh"`;
  console.log("Docker installed successfully.");

  console.log("2/5 Setting Docker to Swarm mode...");
  await $`ssh "${destination}" "sudo docker swarm init --advertise-addr ${ip}"`;
  console.log("Docker swarm mode activated successfully.");

  console.log("3/5 Creating Docker network named 'traefik-public'...");
  await $`ssh "${destination}" "sudo docker network create --driver=overlay traefik-public"`;
  console.log("'traefik-public' network created.");

  console.log(
    "4/5 Creating Docker volume named 'traefik-public-certificates'...",
  );
  await $`ssh "${destination}" "sudo docker volume create traefik-public-certificates"`;
  console.log("'traefik-public-certificates' volume created.");

  console.log("5/5 Deploying Traefik stack...");
  await $`ssh "${destination}" "echo ${$.escape(traefikCompose())} | sudo docker stack deploy -c - traefik"`;
  console.log("Traefik stack started.");
}
