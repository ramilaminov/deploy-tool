import { $ } from "bun";
import { parseArgs } from "util";
import { serviceCompose } from "./service-compose";
import { traefikCompose } from "./traefik-compose";

const DEFAULT_USER = "root";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    ip: {
      type: "string",
    },
    user: {
      type: "string",
      default: DEFAULT_USER,
    },
    domain: {
      type: "string",
    },
    email: {
      type: "string",
    },
  },
  strict: true,
  allowPositionals: true,
});

if (values.ip === undefined) {
  console.error("No --ip provided");
  process.exit(1); // TODO replace
}

if (values.domain === undefined) {
  console.error("No --domain provided");
  process.exit(1); // TODO replace
}

if (values.email === undefined) {
  console.error("No --email provided");
  process.exit(1); // TODO replace
}

const ip = values.ip;
const domain = values.domain;
const letsEncryptEmail = values.email;
const user = values.user ?? DEFAULT_USER;

async function message(text: string) {
  await $`echo ${text}`;
}

async function ssh(command: string) {
  await $`ssh "${user}@${ip}" "${command}"`;
}

async function installDocker() {
  await message("Installing Docker...");

  await ssh("curl -fsSL https://get.docker.com -o get-docker.sh");
  await ssh("sh get-docker.sh");
  await ssh("rm get-docker.sh");

  await message("Docker installed successfully.");
}

async function initDockerSwarm() {
  await message("Setting Docker to Swarm mode...");

  await ssh(`docker swarm init --advertise-addr ${ip}`);

  await message("Docker swarm mode activated successfully.");
}

async function createDockerNetwork() {
  await message("Creating Docker network named 'traefik-public'...");

  await ssh("docker network create --driver=overlay traefik-public");

  await message("'traefik-public' network created.");
}

async function createDockerVolume() {
  await message(
    "Creating Docker volume named 'traefik-public-certificates'...",
  );

  await ssh("docker volume create traefik-public-certificates");

  await message("'traefik-public-certificates' volume created.");
}

async function deployTraefik() {
  await message("Deploying Traefik stack...");

  const compose = traefikCompose({ domain, letsEncryptEmail });
  await $`ssh "${user}@${ip}" "echo \"${$.escape(compose)}\" | docker stack deploy -c - traefik"`;

  await message("Traefik stack started.");
}

async function deployService({
  name,
  image,
  port,
}: {
  name: string;
  image: string;
  port: string;
}) {
  await message(`Deploying ${name} stack...`);

  const compose = serviceCompose({ name, image, port, domain });
  await $`ssh "${user}@${ip}" "echo \"${$.escape(compose)}\" | docker stack deploy -c - ${name}"`;

  await message(`${name} stack started.`);
}

async function run() {
  await installDocker();
  await initDockerSwarm();
  await createDockerNetwork();
  await createDockerVolume();

  await deployTraefik();

  await deployService({
    name: "frontend",
    image: "nginx:latest",
    port: "80",
  });
}

await run();
