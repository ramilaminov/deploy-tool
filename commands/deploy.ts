import { $ } from "bun";
import { serviceCompose } from "../templates/service-compose";

export async function deploy({
  image,
  domain,
  name,
  port,
  sshUser,
}: {
  image: string;
  domain: string;
  name: string;
  port: string;
  sshUser: string;
}) {
  $.throws(true);

  const destination = `${sshUser}@${domain}`;

  console.log(`Deploying '${name}' stack...`);

  const compose = serviceCompose({ name, image, port, domain });
  await $`ssh "${destination}" "echo ${$.escape(compose)} | sudo docker stack deploy -c - ${name}"`;

  console.log(`'${name}' stack started.`);
}
