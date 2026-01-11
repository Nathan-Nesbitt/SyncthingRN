import { ClusterConfigReceivedEventData, ConfigSavedEventData, DeviceConnectedEventData, DeviceDisconnectedEventData, DeviceDiscoveredEventData, DevicePausedEventData, DeviceRejectedEventData, DeviceResumedEventData, DownloadProgressEventData, FailureEventData, FolderCompletionEventData, FolderErrorsEventData, FolderPausedEventData, FolderRejectedEventData, FolderResumedEventData, FolderScanProgressEventData, FolderSummaryEventData, FolderWatchStateChangedEventData, ItemFinishedEventData, ItemStartedEventData, ListenAddressesChangedEventData, LocalChangeDetectedEventData, LocalIndexUpdatedEventData, LoginAttemptEventData, PendingDevicesChangedEventData, PendingFoldersChangedEventData, RemoteChangeDetectedEventData, RemoteDownloadProgressEventData, RemoteIndexUpdatedEventData, StartingEventData, StartupCompleteEventData, StateChangedEventData, SyncthingEvent } from "./SyncthingAPITypes";

// Event API class
export class SyncthingEventAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // Get events from Syncthing
  async getEvents(since?: number, timeout?: number, events?: string[]): Promise<SyncthingEvent[]> {
    const url = new URL(`${this.baseUrl}/rest/events`);
    
    if (since !== undefined) {
      url.searchParams.append('since', since.toString());
    }
    
    if (timeout !== undefined) {
      url.searchParams.append('timeout', timeout.toString());
    }
    
    if (events && events.length > 0) {
      url.searchParams.append('events', events.join(','));
    }

    const response = await fetch(url.toString(), {
      headers: {
        'X-API-Key': this.apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Get a specific event by ID
  async getEvent(id: number): Promise<SyncthingEvent> {
    const response = await fetch(`${this.baseUrl}/rest/events/${id}`, {
      headers: {
        'X-API-Key': this.apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch event ${id}: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Start long polling for events
  async startEventPolling(
    callback: (event: SyncthingEvent) => void,
    since?: number,
    eventTypes?: string[]
  ): Promise<void> {
    const poll = async () => {
      try {
        const eventList = await this.getEvents(since, 30000, eventTypes);
        for (const event of eventList) {
          callback(event);
          if (since === undefined || event.id > since) {
            since = event.id;
          }
        }
        setTimeout(poll, 100); // Poll every 100ms
      } catch (error) {
        console.error('Error polling events:', error);
        setTimeout(poll, 1000); // Retry after 1 second on error
      }
    };

    poll();
  }

  // Event type guards for type safety
  isClusterConfigReceivedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'ClusterConfigReceived', data: ClusterConfigReceivedEventData } {
    return event.type === 'ClusterConfigReceived';
  }

  isConfigSavedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'ConfigSaved', data: ConfigSavedEventData } {
    return event.type === 'ConfigSaved';
  }

  isDeviceConnectedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'DeviceConnected', data: DeviceConnectedEventData } {
    return event.type === 'DeviceConnected';
  }

  isDeviceDisconnectedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'DeviceDisconnected', data: DeviceDisconnectedEventData } {
    return event.type === 'DeviceDisconnected';
  }

  isDeviceDiscoveredEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'DeviceDiscovered', data: DeviceDiscoveredEventData } {
    return event.type === 'DeviceDiscovered';
  }

  isDevicePausedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'DevicePaused', data: DevicePausedEventData } {
    return event.type === 'DevicePaused';
  }

  isDeviceRejectedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'DeviceRejected', data: DeviceRejectedEventData } {
    return event.type === 'DeviceRejected';
  }

  isDeviceResumedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'DeviceResumed', data: DeviceResumedEventData } {
    return event.type === 'DeviceResumed';
  }

  isDownloadProgressEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'DownloadProgress', data: DownloadProgressEventData } {
    return event.type === 'DownloadProgress';
  }

  isFailureEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'Failure', data: FailureEventData } {
    return event.type === 'Failure';
  }

  isFolderCompletionEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'FolderCompletion', data: FolderCompletionEventData } {
    return event.type === 'FolderCompletion';
  }

  isFolderErrorsEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'FolderErrors', data: FolderErrorsEventData } {
    return event.type === 'FolderErrors';
  }

  isFolderPausedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'FolderPaused', data: FolderPausedEventData } {
    return event.type === 'FolderPaused';
  }

  isFolderRejectedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'FolderRejected', data: FolderRejectedEventData } {
    return event.type === 'FolderRejected';
  }

  isFolderResumedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'FolderResumed', data: FolderResumedEventData } {
    return event.type === 'FolderResumed';
  }

  isFolderScanProgressEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'FolderScanProgress', data: FolderScanProgressEventData } {
    return event.type === 'FolderScanProgress';
  }

  isFolderSummaryEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'FolderSummary', data: FolderSummaryEventData } {
    return event.type === 'FolderSummary';
  }

  isFolderWatchStateChangedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'FolderWatchStateChanged', data: FolderWatchStateChangedEventData } {
    return event.type === 'FolderWatchStateChanged';
  }

  isItemFinishedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'ItemFinished', data: ItemFinishedEventData } {
    return event.type === 'ItemFinished';
  }

  isItemStartedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'ItemStarted', data: ItemStartedEventData } {
    return event.type === 'ItemStarted';
  }

  isListenAddressesChangedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'ListenAddressesChanged', data: ListenAddressesChangedEventData } {
    return event.type === 'ListenAddressesChanged';
  }

  isLocalChangeDetectedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'LocalChangeDetected', data: LocalChangeDetectedEventData } {
    return event.type === 'LocalChangeDetected';
  }

  isLocalIndexUpdatedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'LocalIndexUpdated', data: LocalIndexUpdatedEventData } {
    return event.type === 'LocalIndexUpdated';
  }

  isLoginAttemptEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'LoginAttempt', data: LoginAttemptEventData } {
    return event.type === 'LoginAttempt';
  }

  isPendingDevicesChangedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'PendingDevicesChanged', data: PendingDevicesChangedEventData } {
    return event.type === 'PendingDevicesChanged';
  }

  isPendingFoldersChangedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'PendingFoldersChanged', data: PendingFoldersChangedEventData } {
    return event.type === 'PendingFoldersChanged';
  }

  isRemoteChangeDetectedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'RemoteChangeDetected', data: RemoteChangeDetectedEventData } {
    return event.type === 'RemoteChangeDetected';
  }

  isRemoteDownloadProgressEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'RemoteDownloadProgress', data: RemoteDownloadProgressEventData } {
    return event.type === 'RemoteDownloadProgress';
  }

  isRemoteIndexUpdatedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'RemoteIndexUpdated', data: RemoteIndexUpdatedEventData } {
    return event.type === 'RemoteIndexUpdated';
  }

  isStartingEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'Starting', data: StartingEventData } {
    return event.type === 'Starting';
  }

  isStartupCompleteEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'StartupComplete', data: StartupCompleteEventData } {
    return event.type === 'StartupComplete';
  }

  isStateChangedEvent(event: SyncthingEvent): event is SyncthingEvent & { type: 'StateChanged', data: StateChangedEventData } {
    return event.type === 'StateChanged';
  }
}
