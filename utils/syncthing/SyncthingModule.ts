export type SyncthingFlags = Record<string, string | number | boolean | undefined>;

interface SyncthingEnvironmentVariables {
    HOME?: string,
    STHOMEDIR?: string,
    STTRACE?: string,
    STMONITORED?: "1" | "0",
    STNOUPGRADE?: "1" | "0",
    STVERSIONEXTRA?: string,
    SQLITE_TMPDIR?: string,
    FALLBACK_NET_GATEWAY_IPV4?: string,
    ALL_PROXY_NO_FALLBACK?: string,
    all_proxy?: string,
    http_proxy?: string,
    https_proxy?: string,
    GOGC?: string,
    PREF_DEBUG_FACILITIES_ENABLED?: "true" | "false",
}

interface SyncthingResponse {
    command: string[],
    exitCode: number,
    logs: string[]
}

type ShellCommandResponse = SyncthingResponse

interface KillSyncthingResponse {
    responses: SyncthingResponse
}

type RunSyncthingResponse = SyncthingResponse

interface SyncthingModule {
    createSyncthingInstance(commands: string[], environment: SyncthingEnvironmentVariables): Promise<RunSyncthingResponse>;
    killSyncthing(): Promise<KillSyncthingResponse>;
    runShellCommand(command: string): Promise<ShellCommandResponse>;
    spawnSyncthingWorker(environment: SyncthingEnvironmentVariables): Promise<string>;
    stopSyncthingWorker(): Promise<string>;
}

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

async function run(syncthingModule: SyncthingModule, environment: SyncthingEnvironmentVariables, command: string, flags?: SyncthingFlags, extraArgs: string[] = []) {
    // Split the command string into subcommands, e.g., "cli sub" → ["cli", "sub"]
    const commandParts = command.split(" ").filter(Boolean);
    const args = [...commandParts, ...flagsToArgs(flags), ...extraArgs];

    // Try to use native module first if available
    try {
        // const resultCode = await syncthingModule.runShellCommand()
    } catch (err) {

    }
}

function handleSyncthingStop(exitCode: number) {
    switch (exitCode) {
        case 0:
        case 137:
            console.error(`Exit code ${exitCode}. Syncthing was shut down normally via API or SIGKILL.`)
            break;
        case 1:
        case 2:
            console.error(`Exit code ${exitCode}. Another Syncthing instance may be already running.`)
        case 3:
            console.log(`Restarting syncthing.`)
            break;
        case 9:
            console.log(`Exit code ${exitCode}. Syncthing force killed`)
            break;
        case 64:
            console.error(`Exit code ${exitCode}. Error with the command.`)
            break;
        default:
            console.log(`Unknown error on server side.`)
    }
}

// Function to generate Syncthing environment variables
export function generateSyncthingEnvironment(
    home: string = "",
    syncthingHomeDir: string = "",
    syncthingTrace: string[] = [],
    syncthingMonitored: "1" | "0" = "1",
    syncthingNoupGrade: "1" | "0" = "1",
    syncthingVersionExtra: string = "",
    sqlLiteTmpDirectory: string = "",
    useTor: boolean = false,
    socksProxyAddress: string = "",
    httpProxyAddress: string = ""
): SyncthingEnvironmentVariables {
    
    const targetEnv: SyncthingEnvironmentVariables = {
        HOME: home,
        STHOMEDIR: syncthingHomeDir,
        STTRACE: syncthingTrace.join(" "),
        STMONITORED: syncthingMonitored,
        STNOUPGRADE: syncthingNoupGrade,
        STVERSIONEXTRA: syncthingVersionExtra,
        SQLITE_TMPDIR: sqlLiteTmpDirectory,
        GOGC: "100"
    };

    if (useTor) {
        targetEnv.all_proxy = "socks5://localhost:9050"
        targetEnv.ALL_PROXY_NO_FALLBACK = "1"
    } else {
        if (socksProxyAddress) {
            targetEnv.all_proxy = socksProxyAddress 
        } 

        if (httpProxyAddress) {
            targetEnv.http_proxy = httpProxyAddress
            targetEnv.https_proxy = httpProxyAddress
        }
    }

    return targetEnv;
}

// Initialize Syncthing with environment variables
export async function spawnSyncthingWorker(syncthingModule: SyncthingModule, environment: SyncthingEnvironmentVariables) {
    const foo = await syncthingModule.spawnSyncthingWorker(environment)
    console.log(foo)
    return foo
}

export async function killSyncthing(syncthingModule: SyncthingModule) {
    return await syncthingModule.stopSyncthingWorker();
}

async function cli(syncthingModule: SyncthingModule, environment: SyncthingEnvironmentVariables, sub: string, flags?: SyncthingFlags, args: string[] = []) { r
    return await run(syncthingModule, environment,`cli ${sub}`, flags, args); 
}



export function browser(syncthingModule: SyncthingModule, environment: SyncthingEnvironmentVariables, flags?: SyncthingFlags) { return run(syncthingModule, environment, "browser", flags); }

export function decrypt(syncthingModule: SyncthingModule, environment: SyncthingEnvironmentVariables, path: string, flags?: SyncthingFlags) { return run(syncthingModule, environment, "decrypt", flags, [path]); }

export function deviceId(syncthingModule: SyncthingModule, environment: SyncthingEnvironmentVariables, flags?: SyncthingFlags) { return run(syncthingModule, environment, "device-id", flags); }

export function generate(syncthingModule: SyncthingModule, environment: SyncthingEnvironmentVariables, flags?: SyncthingFlags) { return run(syncthingModule, environment, "generate", flags); }

export function paths(syncthingModule: SyncthingModule, environment: SyncthingEnvironmentVariables, flags?: SyncthingFlags) { return run(syncthingModule, environment, "paths", flags); }

export function upgrade(syncthingModule: SyncthingModule, environment: SyncthingEnvironmentVariables, flags?: SyncthingFlags) { return run(syncthingModule, environment, "upgrade", flags); }

export function version(syncthingModule: SyncthingModule, environment: SyncthingEnvironmentVariables, flags?: SyncthingFlags) { return run(syncthingModule, environment, "version", flags); }

export function debug(syncthingModule: SyncthingModule, sub: string, environment: SyncthingEnvironmentVariables, flags?: SyncthingFlags, args: string[] = []) { return run(syncthingModule, environment, `debug ${sub}`, flags, args); }
