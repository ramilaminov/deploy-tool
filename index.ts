import { Clerc, helpPlugin, versionPlugin } from "clerc";
import { deploy } from "./commands/deploy";
import { setup } from "./commands/setup";
import { ssh } from "./utils/ssh";

Clerc.create()
  .scriptName("deploytool")
  .description("Deploy tool")
  .version("0.1.0")
  .use(helpPlugin())
  .use(versionPlugin())
  .command("setup", "Set up a server for future deployment", {
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
  .command("deploy", "Deploy a new version of a service", {
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
        description: "Path prefix the service should handle",
      },
      sshUser: {
        alias: "u",
        type: String,
        default: "root",
        description: "SSH user",
      },
      environment: {
        alias: "e",
        type: [String],
        description: "Environment variables",
      },
      registry: {
        type: String,
        description: "Docker registry server",
      },
      "registry-username": {
        type: String,
        description: "Docker registry username",
      },
      "registry-password": {
        type: String,
        description: "Docker registry password",
      },
    },
  })
  .on("setup", async (context) => {
    const { ip } = context.parameters;
    const { sshUser } = context.flags;

    await setup(ssh(ip, sshUser), { ip });
  })
  .on("deploy", async (context) => {
    const { ip, domain, image, name } = context.parameters;
    const { port, path, sshUser, environment } = context.flags;

    await deploy(ssh(ip, sshUser), {
      domain,
      image,
      name,
      port,
      path,
      environment,
      registry: {
        server: context.flags.registry,
        username: context.flags["registry-username"],
        password: context.flags["registry-password"],
      },
    });
  })
  .parse();
