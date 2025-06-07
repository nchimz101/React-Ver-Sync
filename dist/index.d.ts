import ForceUpdateDetector from './components/ForceUpdateDetector';
import UpdateNotification from './components/UpdateNotification';
import useVersionManager from './hooks/useVersionManager';
import useCacheUpdateManager from './utils/CacheUpdateManager';
export type { VersionManagerOptions, VersionManagerResult } from './hooks/useVersionManager';
export type { CacheUpdateManagerOptions, CacheUpdateManagerResult } from './utils/CacheUpdateManager';
export type { ForceUpdateDetectorProps } from './components/ForceUpdateDetector';
export type { UpdateNotificationProps } from './components/UpdateNotification';
export { ForceUpdateDetector, UpdateNotification, useVersionManager, useCacheUpdateManager, };
declare const _default: {
    ForceUpdateDetector: import("react").FC<import("./components/ForceUpdateDetector").ForceUpdateDetectorProps>;
    UpdateNotification: import("react").FC<import("./components/UpdateNotification").UpdateNotificationProps>;
    useVersionManager: typeof useVersionManager;
    useCacheUpdateManager: typeof useCacheUpdateManager;
};
export default _default;
