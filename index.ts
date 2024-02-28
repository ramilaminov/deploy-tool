import { Clerc } from "clerc";
import { deploy } from "./commands/deploy";
import { setup } from "./commands/setup";
import { ssh } from "./utils/ssh";

Clerc.create()
  .scriptName("Deploy tool")
  .description("Deploy tool")
  .version("0.1.0")
  .command("setup", "Setup server", {
    parameters: ["<ip>"],
    flags: {
      sshUser: {
        alias: "u",
        type: String,
        default: "root",
        description: "SSH user",
      },
    },
  })
  .command("deploy", "Deploy service", {
    parameters: ["<ip>", "<domain>", "<image>", "<name>"],
    flags: {
      port: {
        alias: "p",
        type: String,
        default: "80",
        description: "Port the container listens to",
      },
      path: {
        alias: "P",
        type: String,
        description: "Path prefix",
      },
      sshUser: {
        alias: "u",
        type: String,
        default: "root",
        description: "SSH user",
      },
    },
  })
  .on("setup", async (context) => {
    const { ip } = context.parameters;
    const { sshUser } = context.flags;

    await setup(ssh(ip, sshUser), {
      ip,
    });
  })
  .on("deploy", async (context) => {
    const { ip, domain, image, name } = context.parameters;
    const { port, path, sshUser } = context.flags;

    await deploy(ssh(ip, sshUser), {
      domain,
      image,
      name,
      port,
      path,
    });
  })
  .parse();
