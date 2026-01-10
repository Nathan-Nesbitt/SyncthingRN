// Type definitions based on API documentation

// Configuration types
export interface Folder {
  id: string;
  label: string;
  filesystemType: string;
  path: string;
  type: string;
  devices: Device[];
  rescanIntervalS: number;
  fsWatcherEnabled: boolean;
  fsWatcherDelayS: number;
  ignorePerms: boolean;
  autoNormalize: boolean;
  minDiskFree: {
    value: number;
    unit: string;
  };
  versioning: {
    type: string;
    params: Record<string, any>;
    cleanupIntervalS: number;
    fsPath: string;
    fsType: string;
  };
  copiers: number;
  pullerMaxPendingKiB: number;
  hashes: number;
  order: string;
  ignoreDelete: boolean;
  scanProgressIntervalS: number;
  pullerPauseS: number;
  maxConflicts: number;
  disableSparseFiles: boolean;
  paused: boolean;
  markerName: string;
  copyOwnershipFromParent: boolean;
  modTimeWindowS: number;
  maxConcurrentWrites: number;
  disableFsync: boolean;
  blockPullOrder: string;
  copyRangeMethod: string;
  caseSensitiveFS: boolean;
  junctionsAsDirs: boolean;
}

export interface Device {
  deviceID: string;
  name: string;
  addresses: string[];
  compression: string;
  certName: string;
  introducer: boolean;
  skipIntroductionRemovals: boolean;
  introducedBy: string;
  paused: boolean;
  allowedNetworks: string[];
  autoAcceptFolders: boolean;
  maxSendKbps: number;
  maxRecvKbps: number;
  ignoredFolders: {
    time: string;
    id: string;
    label: string;
  }[];
  maxRequestKiB: number;
  untrusted: boolean;
  remoteGUIPort: number;
}

export interface GUIConfig {
  enabled: boolean;
  address: string;
  unixSocketPermissions: string;
  user: string;
  password: string;
  authMode: string;
  useTLS: boolean;
  apiKey: string;
  insecureAdminAccess: boolean;
  theme: string;
  insecureSkipHostcheck: boolean;
  insecureAllowFrameLoading: boolean;
}

export interface Options {
  listenAddresses: string[];
  globalAnnounceServers: string[];
  globalAnnounceEnabled: boolean;
  localAnnounceEnabled: boolean;
  localAnnouncePort: number;
  localAnnounceMCAddr: string;
  maxSendKbps: number;
  maxRecvKbps: number;
  reconnectionIntervalS: number;
  relaysEnabled: boolean;
  relayReconnectIntervalM: number;
  startBrowser: boolean;
  natEnabled: boolean;
  natLeaseMinutes: number;
  natRenewalMinutes: number;
  natTimeoutSeconds: number;
  urAccepted: number;
  urSeen: number;
  urUniqueId: string;
  urURL: string;
  urPostInsecurely: boolean;
  urInitialDelayS: number;
  autoUpgradeIntervalH: number;
  upgradeToPreReleases: boolean;
  keepTemporariesH: number;
  cacheIgnoredFiles: boolean;
  progressUpdateIntervalS: number;
  limitBandwidthInLan: boolean;
  minHomeDiskFree: {
    value: number;
    unit: string;
  };
  releasesURL: string;
  alwaysLocalNets: string[];
  overwriteRemoteDeviceNamesOnConnect: boolean;
  tempIndexMinBlocks: number;
  unackedNotificationIDs: string[];
  trafficClass: number;
  setLowPriority: boolean;
  maxFolderConcurrency: number;
  crURL: string;
  crashReportingEnabled: boolean;
  stunKeepaliveStartS: number;
  stunKeepaliveMinS: number;
  stunServers: string[];
  maxConcurrentIncomingRequestKiB: number;
  announceLANAddresses: boolean;
  sendFullIndexOnUpgrade: boolean;
  featureFlags: string[];
  connectionLimitEnough: number;
  connectionLimitMax: number;
}

// Database types
export interface DBStatus {
  globalBytes: number;
  globalDeleted: number;
  globalDirectories: number;
  globalFiles: number;
  globalSymlinks: number;
  globalTotalItems: number;
  ignorePatterns: boolean;
  inSyncBytes: number;
  inSyncFiles: number;
  invalid: string;
  localBytes: number;
  localDeleted: number;
  localDirectories: number;
  localFiles: number;
  localSymlinks: number;
  localTotalItems: number;
  needBytes: number;
  needDeletes: number;
  needDirectories: number;
  needFiles: number;
  needSymlinks: number;
  needTotalItems: number;
  pullErrors: number;
  receiveOnlyChangedBytes: number;
  receiveOnlyChangedDeletes: number;
  receiveOnlyChangedDirectories: number;
  receiveOnlyChangedFiles: number;
  receiveOnlyChangedSymlinks: number;
  receiveOnlyTotalItems: number;
  sequence: number;
  state: string;
  stateChanged: string;
  version: number;
}

export interface DBCompletion {
  completion: number;
  globalBytes: number;
  needBytes: number;
  globalItems: number;
  needItems: number;
  needDeletes: number;
  remoteState: string;
  sequence: number;
}

export interface DBFile {
  availability: {
    id: string;
    fromTemporary: boolean;
  }[];
  global: any;
  local: any;
  mtime: {
    err: any;
    value: {
      real: string;
      virtual: string;
    };
  };
}

export interface DBIgnore {
  ignore: string[];
  expanded: string[];
}

// System types
export interface SystemStatus {
  alloc: number;
  connectionServiceStatus: Record<string, {
    error: string | null;
    lanAddresses: string[];
    wanAddresses: string[];
  }>;
  cpuPercent: number;
  discoveryEnabled: boolean;
  discoveryErrors: Record<string, string>;
  discoveryStatus: Record<string, {
    error: string | null;
  }>;
  discoveryMethods: number;
  goroutines: number;
  lastDialStatus: Record<string, {
    when: string;
    error?: string;
    ok?: boolean;
  }>;
  myID: string;
  pathSeparator: string;
  startTime: string;
  sys: number;
  themes: string[];
  tilde: string;
  uptime: number;
}

export interface SystemError {
  errors: {
    when: string;
    message: string;
  }[];
}

export interface SystemLog {
  messages: {
    when: string;
    message: string;
  }[];
}

export interface SystemPaths {
  auditLog: string;
  baseDirConfig: string;
  baseDirData: string;
  baseDirUserHome: string;
  certFile: string;
  config: string;
  csrfTokens: string;
  database: string;
  defFolder: string;
  guiAssets: string;
  httpsCertFile: string;
  httpsKeyFile: string;
  keyFile: string;
  logFile: string;
  panicLog: string;
}

export interface SystemVersion {
  arch: string;
  longVersion: string;
  os: string;
  version: string;
}

export interface SystemUpgrade {
  latest: string;
  majorNewer: boolean;
  newer: boolean;
  running: string;
}

// Stats types
export interface StatsDevice {
  [deviceId: string]: {
    lastSeen: string;
    lastConnectionDurationS: number;
  };
}

export interface StatsFolder {
  [folderId: string]: {
    lastScan: string;
    lastFile: {
      filename: string;
      at: string;
      deleted ?: boolean;
    };
  };
}

// Cluster types
export interface ClusterPendingDevices {
  [deviceId: string]: {
    time: string;
    name: string;
    address: string;
  };
}

export interface ClusterPendingFolders {
  [folderId: string]: {
    offeredBy: Record<string, {
      time: string;
      label: string;
      receiveEncrypted: boolean;
      remoteEncrypted: boolean;
    }>;
  };
}

// Folder types
export interface FolderErrors {
  folder: string;
  errors: {
    path: string;
    error: string;
  }[];
  page: number;
  perpage: number;
}

export interface FolderVersions {
  [filePath: string]: {
    versionTime: string;
    modTime: string;
    size: number;
  }[];
}

// Service types
export interface SVCDeviceId {
  id?: string;
  error?: string;
}

export interface SVCReport {
  folderMaxMiB: number;
  platform: string;
  totMiB: number;
  longVersion: string;
  upgradeAllowedManual: boolean;
  totFiles: number;
  folderUses: Record<string, number>;
  memoryUsageMiB: number;
  version: string;
  sha256Perf: number;
  numFolders: number;
  memorySize: number;
  announce: Record<string, number>;
  usesRateLimit: boolean;
  numCPU: number;
  uniqueID: string;
  urVersion: number;
  rescanIntvs: number[];
  numDevices: number;
  folderMaxFiles: number;
  relays: Record<string, number>;
  deviceUses: Record<string, number>;
  upgradeAllowedAuto: boolean;
}

export interface SVCRandomString {
  random: string;
}

// Event types
export interface Event {
  id: number;
  time: string;
  type: string;
  data: any;
}

// Pagination parameters
export interface PaginationParams {
  page?: number;
  perpage?: number;
  limit?: number;
  since?: number;
  timeout?: number;
}