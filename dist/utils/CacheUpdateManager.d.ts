export interface CacheUpdateManagerOptions {
    /**
     * Whether an update is available
     */
    isUpdateAvailable: boolean;
    /**
     * Function to execute when update is confirmed
     */
    onUpdateConfirmed?: () => Promise<void>;
    /**
     * Function to execute when update is postponed
     */
    onUpdatePostponed?: () => void;
    /**
     * Duration in milliseconds to countdown before auto-updating
     */
    countdownDuration?: number;
    /**
     * Duration in milliseconds to consider user inactive
     */
    inactivityThreshold?: number;
    /**
     * Maximum number of times user can postpone the update
     */
    maxPostponeCount?: number;
}
export interface CacheUpdateManagerResult {
    /**
     * Whether the update is in progress
     */
    isUpdateInProgress: boolean;
    /**
     * Whether the update has been postponed
     */
    isPostponed: boolean;
    /**
     * Number of times the update has been postponed
     */
    postponeCount: number;
    /**
     * Time left in countdown (in seconds)
     */
    countdownSeconds: number;
    /**
     * Function to handle the update now
     */
    handleUpdate: () => Promise<void>;
    /**
     * Function to postpone the update
     */
    postponeUpdate: () => void;
    /**
     * Start the automatic update process
     */
    startAutoUpdateProcess: () => void;
}
/**
 * Hook for managing cache update processes with user activity detection
 */
declare function useCacheUpdateManager({ isUpdateAvailable, onUpdateConfirmed, onUpdatePostponed, countdownDuration, inactivityThreshold, maxPostponeCount, }: CacheUpdateManagerOptions): CacheUpdateManagerResult;
export default useCacheUpdateManager;
