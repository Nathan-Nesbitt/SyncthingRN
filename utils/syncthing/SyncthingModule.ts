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

export interface SyncthingModule {
    runShellCommand(command: string): Promise<ShellCommandResponse>;
    spawnSyncthingWorker(environment: SyncthingEnvironmentVariables): Promise<void>;
    getAPIKey(): Promise<string>;
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