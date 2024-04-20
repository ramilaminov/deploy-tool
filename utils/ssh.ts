import { $, type ShellPromise } from "bun";

export type SSHRunner = (command: string) => ShellPromise;

export const ssh =
  (ip: string, sshUser: string): SSHRunner =>
  (command: string) =>
    $`ssh ${sshUser}@${ip} ${command}`.throws(true);
