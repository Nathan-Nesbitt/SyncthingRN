import { exec } from 'child_process';

export type SyncthingFlags = Record<string, string | number | boolean | undefined>;

function flagsToArgs(flags?: SyncthingFlags): string[] {
    if (!flags) return [];
    const args: string[] = [];

    for (const [key, value] of Object.entries(flags)) {
        if (value === undefined || value === false) continue;

        if (value === true) args.push(`--${key}`);
        else args.push(`--${key}=${value}`);
    }
    return args;
}

export class SyncthingExec {
    constructor(private binary: string = "syncthing") {}

    private async run(command: string, flags?: SyncthingFlags, extraArgs: string[] = []) {
        const args = [command, ...flagsToArgs(flags), ...extraArgs].join(" ");
        const full = `${this.binary} ${args}`.trim();

        return exec(full);
    }

    serve(flags?: SyncthingFlags) { return this.run("serve", flags); }
    cli(sub: string, flags?: SyncthingFlags, args: string[] = []) { return this.run(`cli ${sub}`, flags, args); }
    browser(flags?: SyncthingFlags) { return this.run("browser", flags); }
    decrypt(path: string, flags?: SyncthingFlags) { return this.run("decrypt", flags, [path]); }
    deviceId(flags?: SyncthingFlags) { return this.run("device-id", flags); }
    generate(flags?: SyncthingFlags) { return this.run("generate", flags); }
    paths(flags?: SyncthingFlags) { return this.run("paths", flags); }
    upgrade(flags?: SyncthingFlags) { return this.run("upgrade", flags); }
    version(flags?: SyncthingFlags) { return this.run("version", flags); }
    debug(sub: string, flags?: SyncthingFlags, args: string[] = []) { return this.run(`debug ${sub}`, flags, args); }
}