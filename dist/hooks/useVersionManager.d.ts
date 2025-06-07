export interface VersionManagerOptions {
    version: string;
    build: number;
    minBuildToForceUpdate?: number;
    onForceUpdate?: () => void;
    onUpdateAvailable?: () => void;
    onUpdateComplete?: () => void;
}
export interface VersionManagerResult {
    currentVersion: string;
    currentBuild: number;
    isUpdateAvailable: boolean;
    isForceUpdate: boolean;
    lastChecked: number;
    forceUpdate: () => Promise<void>;
    checkForUpdates: () => void;
}
/**
 * Hook for managing version information and update processes
 */
declare function useVersionManager({ version, build, minBuildToForceUpdate, onForceUpdate, onUpdateAvailable, onUpdateComplete, }: VersionManagerOptions): VersionManagerResult;
export default useVersionManager;
