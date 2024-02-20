import { Clerc } from "clerc";
import { deploy } from "./commands/deploy";
import { setup } from "./commands/setup";

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
    parameters: ["<image>", "<domain>", "<name>"],
    flags: {
      port: {
        alias: "p",
        type: String,
        default: "80",
        description: "Port the container listens to",
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
    await setup({
      ip: context.parameters.ip,
      sshUser: context.flags.sshUser,
    });
  })
  .on("deploy", async (context) => {
    await deploy({
      image: context.parameters.image,
      domain: context.parameters.domain,
      name: context.parameters.name,
      port: context.flags.port,
      sshUser: context.flags.sshUser,
    });
  })
  .parse();
