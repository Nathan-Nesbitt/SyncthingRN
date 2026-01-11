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

// API input type for adding a device
export interface AddDeviceInput {
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

// Event type definitions based on the documentation
export interface ClusterConfigReceivedEventData {
  device: string;
}

export interface ConfigSavedEventData {
  version: number;
  folders: any[];
  devices: any[];
  gui: any;
  ldap: any;
  options: any;
  remoteIgnoredDevices: any[];
  defaults: any;
}

export interface DeviceConnectedEventData {
  addr: string;
  id: string;
  deviceName: string;
  clientName: string;
  clientVersion: string;
  type: string;
}

export interface DeviceDisconnectedEventData {
  error: string;
  id: string;
}

export interface DeviceDiscoveredEventData {
  addrs: string[];
  device: string;
}

export interface DevicePausedEventData {
  device: string;
}

export interface DeviceRejectedEventData {
  address: string;
  name: string;
  device: string;
}

export interface DeviceResumedEventData {
  device: string;
}

export interface DownloadProgressEventData {
  [folder: string]: {
    [file: string]: {
      total: number;
      pulling: number;
      copiedFromOrigin: number;
      reused: number;
      copiedFromElsewhere: number;
      pulled: number;
      bytesTotal: number;
      bytesDone: number;
    };
  };
}

export interface FailureEventData {
  error: string;
}

export interface FolderCompletionEventData {
  completion: number;
  device: string;
  folder: string;
  globalBytes: number;
  globalItems: number;
  needBytes: number;
  needDeletes: number;
  needItems: number;
  remoteState: string;
  sequence: number;
}

export interface FolderErrorsEventData {
  errors: {
    error: string;
    path: string;
  }[];
  folder: string;
}

export interface FolderPausedEventData {
  id: string;
  label: string;
}

export interface FolderRejectedEventData {
  device: string;
  folder: string;
  folderLabel: string;
}

export interface FolderResumedEventData {
  id: string;
  label: string;
}

export interface FolderScanProgressEventData {
  total: number;
  rate: number;
  current: number;
  folder: string;
}

export interface FolderSummaryEventData {
  folder: string;
  summary: any;
}

export interface FolderWatchStateChangedEventData {
  folder: string;
  from: string;
  to: string;
}

export interface ItemFinishedEventData {
  item: string;
  folder: string;
  error: string | null;
  type: string;
  action: string;
}

export interface ItemStartedEventData {
  item: string;
  folder: string;
  type: string;
  action: string;
}

export interface ListenAddressesChangedEventData {
  address: any;
  wan: any[];
  lan: any[];
}

export interface LocalChangeDetectedEventData {
  action: string;
  folder: string;
  folderID: string;
  label: string;
  path: string;
  type: string;
}

export interface LocalIndexUpdatedEventData {
  folder: string;
  items: number;
  filenames: string[];
  sequence: number;
  version: number;
}

export interface LoginAttemptEventData {
  remoteAddress: string;
  username: string;
  success: boolean;
  proxy?: string;
}

export interface PendingDevicesChangedEventData {
  added: {
    address: string;
    deviceID: string;
    name: string;
  }[];
  removed: {
    deviceID: string;
  }[];
}

export interface PendingFoldersChangedEventData {
  added: {
    deviceID: string;
    folderID: string;
    folderLabel: string;
    receiveEncrypted: string;
    remoteEncrypted: string;
  }[];
  removed: {
    deviceID?: string;
    folderID: string;
  }[];
}

export interface RemoteChangeDetectedEventData {
  type: string;
  action: string;
  folder: string;
  folderID: string;
  path: string;
  label: string;
  modifiedBy: string;
}

export interface RemoteDownloadProgressEventData {
  state: {
    [file: string]: number;
  };
  device: string;
  folder: string;
}

export interface RemoteIndexUpdatedEventData {
  device: string;
  folder: string;
  items: number;
}

export interface StartingEventData {
  home: string;
}

export interface StartupCompleteEventData {
  // This event has no data
}

export interface StateChangedEventData {
  folder: string;
  from: string;
  duration: number;
  to: string;
}

// Union type of all event data types
export type EventData = 
  | ClusterConfigReceivedEventData
  | ConfigSavedEventData
  | DeviceConnectedEventData
  | DeviceDisconnectedEventData
  | DeviceDiscoveredEventData
  | DevicePausedEventData
  | DeviceRejectedEventData
  | DeviceResumedEventData
  | DownloadProgressEventData
  | FailureEventData
  | FolderCompletionEventData
  | FolderErrorsEventData
  | FolderPausedEventData
  | FolderRejectedEventData
  | FolderResumedEventData
  | FolderScanProgressEventData
  | FolderSummaryEventData
  | FolderWatchStateChangedEventData
  | ItemFinishedEventData
  | ItemStartedEventData
  | ListenAddressesChangedEventData
  | LocalChangeDetectedEventData
  | LocalIndexUpdatedEventData
  | LoginAttemptEventData
  | PendingDevicesChangedEventData
  | PendingFoldersChangedEventData
  | RemoteChangeDetectedEventData
  | RemoteDownloadProgressEventData
  | RemoteIndexUpdatedEventData
  | StartingEventData
  | StartupCompleteEventData
  | StateChangedEventData;

// Event type mapping for type-safe access
export interface EventTypeMap {
  ClusterConfigReceived: ClusterConfigReceivedEventData;
  ConfigSaved: ConfigSavedEventData;
  DeviceConnected: DeviceConnectedEventData;
  DeviceDisconnected: DeviceDisconnectedEventData;
  DeviceDiscovered: DeviceDiscoveredEventData;
  DevicePaused: DevicePausedEventData;
  DeviceRejected: DeviceRejectedEventData;
  DeviceResumed: DeviceResumedEventData;
  DownloadProgress: DownloadProgressEventData;
  Failure: FailureEventData;
  FolderCompletion: FolderCompletionEventData;
  FolderErrors: FolderErrorsEventData;
  FolderPaused: FolderPausedEventData;
  FolderRejected: FolderRejectedEventData;
  FolderResumed: FolderResumedEventData;
  FolderScanProgress: FolderScanProgressEventData;
  FolderSummary: FolderSummaryEventData;
  FolderWatchStateChanged: FolderWatchStateChangedEventData;
  ItemFinished: ItemFinishedEventData;
  ItemStarted: ItemStartedEventData;
  ListenAddressesChanged: ListenAddressesChangedEventData;
  LocalChangeDetected: LocalChangeDetectedEventData;
  LocalIndexUpdated: LocalIndexUpdatedEventData;
  LoginAttempt: LoginAttemptEventData;
  PendingDevicesChanged: PendingDevicesChangedEventData;
  PendingFoldersChanged: PendingFoldersChangedEventData;
  RemoteChangeDetected: RemoteChangeDetectedEventData;
  RemoteDownloadProgress: RemoteDownloadProgressEventData;
  RemoteIndexUpdated: RemoteIndexUpdatedEventData;
  Starting: StartingEventData;
  StartupComplete: StartupCompleteEventData;
  StateChanged: StateChangedEventData;
}

// Base event structure
export interface SyncthingEvent extends Event {
  type: keyof EventTypeMap;
  data: EventTypeMap[keyof EventTypeMap];
}
