import { ClusterPendingDevices, ClusterPendingFolders, DBCompletion, DBFile, DBIgnore, DBStatus, Device, Folder, FolderErrors, FolderVersions, GUIConfig, Options, PaginationParams, StatsDevice, StatsFolder, SVCDeviceId, SVCRandomString, SVCReport, SystemError, SystemLog, SystemPaths, SystemStatus, SystemUpgrade, SystemVersion } from "./SyncthingAPITypes";
import { SyncthingEventAPI } from "./SyncthingEventAPI";

// Base URL for Syncthing API
const BASE_URL = 'http://127.0.0.1:8384/rest';

// Syncthing API Client
class SyncthingAPI {
  private baseUrl: string;
  private apiKey: string;
  private headers: Record<string, string>; 
  
  public syncthingEventApi: SyncthingEventAPI;

  constructor(apiKey: string) {
    this.baseUrl = BASE_URL;
    this.apiKey = apiKey;
    this.headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
    };
    this.syncthingEventApi = new SyncthingEventAPI(this.baseUrl, this.apiKey);
  }

  // === Generic API methods ===

  /**
   * Generic GET request method
   */
  private async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as unknown as T;
    }
  }

  /**
   * Generic POST request method
   */
  private async post<T>(endpoint: string, body?: any, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as unknown as T;
    }
  }

  /**
   * Generic PUT request method
   */
  private async put<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'PUT',
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as unknown as T;
    }
  }

  /**
   * Generic DELETE request method
   */
  private async delete<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString());
        }
      });
    }
    const response = await fetch(url.toString(), {
      method: 'DELETE',
      headers: this.headers,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as unknown as T;
    }
  }

  /**
   * Generic PATCH request method
   */
  private async patch<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      method: 'PATCH',
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as unknown as T;
    }
  }

  // === Cluster Endpoints ===

  /**
   * Get pending devices
   */
  async getClusterPendingDevices(): Promise<ClusterPendingDevices> {
    return await this.get<ClusterPendingDevices>('cluster/pending/devices');
  }

  /**
   * Delete pending device
   */
  async deleteClusterPendingDevice(device: string): Promise<void> {
    await this.delete<void>('cluster/pending/devices', { device });
  }

  /**
   * Get pending folders
   */
  async getClusterPendingFolders(device?: string): Promise<ClusterPendingFolders> {
    return await this.get<ClusterPendingFolders>('cluster/pending/folders', device ? { device } : undefined);
  }

  /**
   * Delete pending folder
   */
  async deleteClusterPendingFolder(folder: string, device?: string): Promise<void> {
    await this.delete<void>('cluster/pending/folders', { folder, device });
  }

  // === Config Endpoints ===

  /**
   * Get config
   */
  async getConfig(): Promise<any> {
    return await this.get<any>('config');
  }

  /**
   * Update config
   */
  async putConfig(config: any): Promise<void> {
    await this.put<void>('config', config);
  }

  /**
   * Check if restart is required
   */
  async getConfigRestartRequired(): Promise<{configInSync: boolean}> {
    return await this.get<{configInSync: boolean}>('config/restart-required');
  }

  /**
   * Get config folders
   */
  async getConfigFolders(): Promise<Folder[]> {
    return await this.get<Folder[]>('config/folders');
  }

  /**
   * Update config folders
   */
  async putConfigFolders(folders: Folder[]): Promise<void> {
    await this.put<void>('config/folders', folders);
  }

  /**
   * Add config folder
   */
  async postConfigFolder(folder: Folder): Promise<void> {
    await this.post<void>('config/folders', folder);
  }

  /**
   * Get config folder
   */
  async getConfigFolder(id: string): Promise<Folder> {
    return await this.get<Folder>(`config/folders/${id}`);
  }

  /**
   * Update config folder
   */
  async putConfigFolder(id: string, folder: Folder): Promise<void> {
    await this.put<void>(`config/folders/${id}`, folder);
  }

  /**
   * Patch config folder
   */
  async patchConfigFolder(id: string, folder: Partial<Folder>): Promise<void> {
    await this.patch<void>(`config/folders/${id}`, folder);
  }

  /**
   * Delete config folder
   */
  async deleteConfigFolder(id: string): Promise<void> {
    await this.delete<void>(`config/folders/${id}`);
  }

  /**
   * Get config devices
   */
  async getConfigDevices(): Promise<Device[]> {
    return await this.get<Device[]>('config/devices');
  }

  /**
   * Update config devices
   */
  async putConfigDevices(devices: Device[]): Promise<void> {
    await this.put<void>('config/devices', devices);
  }

  /**
   * Add config device
   */
  async postConfigDevice(device: Device): Promise<void> {
    await this.post<void>('config/devices', device);
  }

  /**
   * Get config device
   */
  async getConfigDevice(id: string): Promise<Device> {
    return await this.get<Device>(`config/devices/${id}`);
  }

  /**
   * Update config device
   */
  async putConfigDevice(id: string, device: Device): Promise<void> {
    await this.put<void>(`config/devices/${id}`, device);
  }

  /**
   * Patch config device
   */
  async patchConfigDevice(id: string, device: Partial<Device>): Promise<void> {
    await this.patch<void>(`config/devices/${id}`, device);
  }

  /**
   * Delete config device
   */
  async deleteConfigDevice(id: string): Promise<void> {
    await this.delete<void>(`config/devices/${id}`);
  }

  /**
   * Get default folder config
   */
  async getConfigDefaultsFolder(): Promise<Folder> {
    return await this.get<Folder>('config/defaults/folder');
  }

  /**
   * Update default folder config
   */
  async putConfigDefaultsFolder(folder: Folder): Promise<void> {
    await this.put<void>('config/defaults/folder', folder);
  }

  /**
   * Patch default folder config
   */
  async patchConfigDefaultsFolder(folder: Partial<Folder>): Promise<void> {
    await this.patch<void>('config/defaults/folder', folder);
  }

  /**
   * Get default device config
   */
  async getConfigDefaultsDevice(): Promise<Device> {
    return await this.get<Device>('config/defaults/device');
  }

  /**
   * Update default device config
   */
  async putConfigDefaultsDevice(device: Device): Promise<void> {
    await this.put<void>('config/defaults/device', device);
  }

  /**
   * Patch default device config
   */
  async patchConfigDefaultsDevice(device: Partial<Device>): Promise<void> {
    await this.patch<void>('config/defaults/device', device);
  }

  /**
   * Get default ignore patterns
   */
  async getConfigDefaultsIgnores(): Promise<{lines: string[]}> {
    return await this.get<{lines: string[]}>('config/defaults/ignores');
  }

  /**
   * Update default ignore patterns
   */
  async putConfigDefaultsIgnores(ignores: {lines: string[]}): Promise<void> {
    await this.put<void>('config/defaults/ignores', ignores);
  }

  /**
   * Get config options
   */
  async getConfigOptions(): Promise<Options> {
    return await this.get<Options>('config/options');
  }

  /**
   * Update config options
   */
  async putConfigOptions(options: Options): Promise<void> {
    await this.put<void>('config/options', options);
  }

  /**
   * Patch config options
   */
  async patchConfigOptions(options: Partial<Options>): Promise<void> {
    await this.patch<void>('config/options', options);
  }

  /**
   * Get config GUI
   */
  async getConfigGUI(): Promise<GUIConfig> {
    return await this.get<GUIConfig>('config/gui');
  }

  /**
   * Update config GUI
   */
  async putConfigGUI(gui: GUIConfig): Promise<void> {
    await this.put<void>('config/gui', gui);
  }

  /**
   * Patch config GUI
   */
  async patchConfigGUI(gui: Partial<GUIConfig>): Promise<void> {
    await this.patch<void>('config/gui', gui);
  }

  // === DB Endpoints ===

  /**
   * Browse database
   */
  async getDBBrowse(folder: string, levels?: number, prefix?: string): Promise<any> {
    return await this.get<any>('db/browse', { folder, levels, prefix });
  }

  /**
   * Get database completion
   */
  async getDBCompletion(folder?: string, device?: string): Promise<DBCompletion> {
    return await this.get<DBCompletion>('db/completion', { folder, device });
  }

  /**
   * Get database file
   */
  async getDBFile(folder: string, file: string): Promise<DBFile> {
    return await this.get<DBFile>('db/file', { folder, file });
  }

  /**
   * Get database ignores
   */
  async getDBIgnores(folder: string): Promise<DBIgnore> {
    return await this.get<DBIgnore>('db/ignores', { folder });
  }

  /**
   * Update database ignores
   */
  async postDBIgnores(folder: string, ignorePatterns: string[]): Promise<DBIgnore> {
    return await this.post<DBIgnore>('db/ignores', { ignore: ignorePatterns }, { folder });
  }

  /**
   * Get local changed files
   */
  async getDBLocalChanged(folder: string, pagination?: PaginationParams): Promise<any> {
    const params: Record<string, string> = { folder };
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined) params[key] = value.toString();
      });
    }
    return await this.get<any>('db/localchanged', params);
  }

  /**
   * Get needed files
   */
  async getDBNeed(folder: string, pagination?: PaginationParams): Promise<any> {
    const params: Record<string, string> = { folder };
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined) params[key] = value.toString();
      });
    }
    return await this.get<any>('db/need', params);
  }

  /**
   * Override folder
   */
  async postDBOverride(folder: string): Promise<void> {
    await this.post<void>('db/override', undefined, { folder });
  }

  /**
   * Set file priority
   */
  async postDBPrio(folder: string, file: string): Promise<any> {
    return await this.post<any>('db/prio', undefined, { folder, file });
  }

  /**
   * Get remote needed files
   */
  async getDBRemoteNeed(folder: string, device: string, pagination?: PaginationParams): Promise<any> {
    const params: Record<string, string> = { folder, device };
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined) params[key] = value.toString();
      });
    }
    return await this.get<any>('db/remoteneed', params);
  }

  /**
   * Revert folder
   */
  async postDBRevert(folder: string): Promise<void> {
    await this.post<void>('db/revert', undefined, { folder });
  }

  /**
   * Scan folder
   */
  async postDBScan(folder?: string, sub?: string, next?: number): Promise<void> {
    const params: Record<string, string> = {};
    if (folder) params.folder = folder;
    if (sub) params.sub = sub;
    if (next !== undefined) params.next = next.toString();
    await this.post<void>('db/scan', undefined, params);
  }

  /**
   * Get database status
   */
  async getDBStatus(folder: string): Promise<DBStatus> {
    return await this.get<DBStatus>('db/status', { folder });
  }

  // === System Endpoints ===

  /**
   * Browse system paths
   */
  async getSystemBrowse(current?: string): Promise<string[]> {
    return await this.get<string[]>('system/browse', current ? { current } : undefined);
  }

  /**
   * Get system config
   */
  async getSystemConfig(): Promise<any> {
    return await this.get<any>('system/config');
  }

  /**
   * Update system config
   */
  async putSystemConfig(config: any): Promise<void> {
    await this.put<void>('system/config', config);
  }

  /**
   * Get system connections
   */
  async getSystemConnections(): Promise<any> {
    return await this.get<any>('system/connections');
  }

  /**
   * Get system discovery cache
   */
  async getSystemDiscovery(): Promise<any> {
    return await this.get<any>('system/discovery');
  }

  /**
   * Add system discovery entry
   */
  async postSystemDiscovery(device: string, addr: string): Promise<void> {
    await this.post<void>('system/discovery', undefined, { device, addr });
  }

  /**
   * Get system errors
   */
  async getSystemError(): Promise<SystemError> {
    return await this.get<SystemError>('system/error');
  }

  /**
   * Post system error
   */
  async postSystemError(message: string): Promise<void> {
    await this.post<void>('system/error', message);
  }

  /**
   * Clear system errors
   */
  async postSystemErrorClear(): Promise<void> {
    await this.post<void>('system/error/clear');
  }

  /**
   * Get system log
   */
  async getSystemLog(since?: string): Promise<SystemLog> {
    return await this.get<SystemLog>('system/log', since ? { since } : undefined);
  }

  /**
   * Get system log as text
   */
  async getSystemLogTxt(since?: string): Promise<string> {
    return await this.get<string>('system/log.txt', since ? { since } : undefined);
  }

  /**
   * Get system log levels
   */
  async getSystemLogLevels(): Promise<any> {
    return await this.get<any>('system/loglevels');
  }

  /**
   * Update system log levels
   */
  async postSystemLogLevels(levels: Record<string, string>): Promise<void> {
    await this.post<void>('system/loglevels', levels);
  }

  /**
   * Get system paths
   */
  async getSystemPaths(): Promise<SystemPaths> {
    return await this.get<SystemPaths>('system/paths');
  }

  /**
   * Pause device(s)
   */
  async postSystemPause(device?: string): Promise<void> {
    await this.post<void>('system/pause', undefined, device ? { device } : undefined);
  }

  /**
   * Ping system
   */
  async getSystemPing(): Promise<{ping: string}> {
    return await this.get<{ping: string}>('system/ping');
  }

  /**
   * Ping system (POST)
   */
  async postSystemPing(): Promise<{ping: string}> {
    return await this.post<{ping: string}>('system/ping');
  }

  /**
   * Reset system
   */
  async postSystemReset(folder?: string): Promise<void> {
    await this.post<void>('system/reset', undefined, folder ? { folder } : undefined);
  }

  /**
   * Restart system
   */
  async postSystemRestart(): Promise<void> {
    await this.post<void>('system/restart');
  }

  /**
   * Resume device(s)
   */
  async postSystemResume(device?: string): Promise<void> {
    await this.post<void>('system/resume', undefined, device ? { device } : undefined);
  }

  /**
   * Shutdown system
   */
  async postSystemShutdown(): Promise<void> {
    await this.post<void>('system/shutdown');
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<SystemStatus> {
    return await this.get<SystemStatus>('system/status');
  }

  /**
   * Check system upgrade
   */
  async getSystemUpgrade(): Promise<SystemUpgrade> {
    return await this.get<SystemUpgrade>('system/upgrade');
  }

  /**
   * Perform system upgrade
   */
  async postSystemUpgrade(): Promise<void> {
    await this.post<void>('system/upgrade');
  }

  /**
   * Get system version
   */
  async getSystemVersion(): Promise<SystemVersion> {
    return await this.get<SystemVersion>('system/version');
  }

  // === Stats Endpoints ===

  /**
   * Get device stats
   */
  async getStatsDevice(): Promise<StatsDevice> {
    return await this.get<StatsDevice>('stats/device');
  }

  /**
   * Get folder stats
   */
  async getStatsFolder(): Promise<StatsFolder> {
    return await this.get<StatsFolder>('stats/folder');
  }

  // === Service Endpoints ===

  /**
   * Verify device ID
   */
  async getSVCDeviceId(id: string): Promise<SVCDeviceId> {
    return await this.get<SVCDeviceId>('svc/deviceid', { id });
  }

  /**
   * Get service languages
   */
  async getSVCLang(): Promise<string[]> {
    return await this.get<string[]>('svc/lang');
  }

  /**
   * Generate random string
   */
  async getSVCRandomString(length: number): Promise<SVCRandomString> {
    return await this.get<SVCRandomString>('svc/random/string', { length });
  }

  /**
   * Get service report
   */
  async getSVCReport(): Promise<SVCReport> {
    return await this.get<SVCReport>('svc/report');
  }

  // === Events Endpoints ===

  /**
   * Get events
   */
  async getEvents(events?: string[], since?: number, limit?: number, timeout?: number): Promise<Event[]> {
    const params: Record<string, string> = {};
    if (events && events.length > 0) params.events = events.join(',');
    if (since !== undefined) params.since = since.toString();
    if (limit !== undefined) params.limit = limit.toString();
    if (timeout !== undefined) params.timeout = timeout.toString();
    return await this.get<Event[]>('events', params);
  }

  /**
   * Get disk events
   */
  async getEventsDisk(): Promise<Event[]> {
    return await this.get<Event[]>('events/disk');
  }

  // === Folder Endpoints ===

  /**
   * Get folder errors
   */
  async getFolderErrors(folder: string, pagination?: PaginationParams): Promise<FolderErrors> {
    const params: Record<string, string> = { folder };
    if (pagination) {
      Object.entries(pagination).forEach(([key, value]) => {
        if (value !== undefined) params[key] = value.toString();
      });
    }
    return await this.get<FolderErrors>('folder/errors', params);
  }

  /**
   * Get folder pull errors (deprecated)
   */
  async getFolderPullErrors(folder: string): Promise<FolderErrors> {
    return await this.get<FolderErrors>('folder/pullerrors', { folder });
  }

  /**
   * Get folder versions
   */
  async getFolderVersions(folder: string): Promise<FolderVersions> {
    return await this.get<FolderVersions>('folder/versions', { folder });
  }

  /**
   * Restore folder versions
   */
  async postFolderVersions(folder: string, versions: Record<string, string>): Promise<any> {
    return await this.post<any>('folder/versions', versions, { folder });
  }

  // === Debug Endpoints ===

  /**
   * Get CPU profile
   */
  async getDebugCpuProf(): Promise<Blob> {
    return await this.get<Blob>('debug/cpuprof');
  }

  /**
   * Get heap profile
   */
  async getDebugHeapProf(): Promise<Blob> {
    return await this.get<Blob>('debug/heapprof');
  }

  /**
   * Get support info
   */
  async getDebugSupport(): Promise<Blob> {
    return await this.get<Blob>('debug/support');
  }

  /**
   * Get debug file info
   */
  async getDebugFile(folder: string, file: string): Promise<any> {
    return await this.get<any>('debug/file', { folder, file });
  }

  // === Health Check Endpoints ===

  /**
   * Get health status
   */
  async getNoAuthHealth(): Promise<{status: string}> {
    return await this.get<{status: string}>('noauth/health');
  }
}

export default SyncthingAPI;