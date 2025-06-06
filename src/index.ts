// Export all components and hooks
import ForceUpdateDetector from './components/ForceUpdateDetector';
import UpdateNotification from './components/UpdateNotification';
import useVersionManager from './hooks/useVersionManager';
import useCacheUpdateManager from './utils/CacheUpdateManager';

// Types
export type { VersionManagerOptions, VersionManagerResult } from './hooks/useVersionManager';
export type { CacheUpdateManagerOptions, CacheUpdateManagerResult } from './utils/CacheUpdateManager';
export type { ForceUpdateDetectorProps } from './components/ForceUpdateDetector';
export type { UpdateNotificationProps } from './components/UpdateNotification';

// Default exports
export {
  ForceUpdateDetector,
  UpdateNotification,
  useVersionManager,
  useCacheUpdateManager,
};

// For CommonJS compatibility
export default {
  ForceUpdateDetector,
  UpdateNotification,
  useVersionManager,
  useCacheUpdateManager,
};
