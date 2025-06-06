import { useState, useEffect, useCallback, useRef } from 'react';

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
function useVersionManager({
  version,
  build,
  minBuildToForceUpdate = 150,
  onForceUpdate,
  onUpdateAvailable,
  onUpdateComplete,
}: VersionManagerOptions): VersionManagerResult {
  const [currentVersion, setCurrentVersion] = useState<string>(
    localStorage.getItem('app_version') || version
  );
  const [currentBuild, setCurrentBuild] = useState<number>(
    parseInt(localStorage.getItem('app_build') || '0', 10) || build
  );
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [isForceUpdate, setIsForceUpdate] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<number>(Date.now());
  
  // Store the callbacks in refs to avoid dependency issues
  const onForceUpdateRef = useRef(onForceUpdate);
  const onUpdateAvailableRef = useRef(onUpdateAvailable);
  const onUpdateCompleteRef = useRef(onUpdateComplete);

  useEffect(() => {
    onForceUpdateRef.current = onForceUpdate;
    onUpdateAvailableRef.current = onUpdateAvailable;
    onUpdateCompleteRef.current = onUpdateComplete;
  }, [onForceUpdate, onUpdateAvailable, onUpdateComplete]);

  /**
   * Force update by clearing caches and reloading the application
   */
  const forceUpdate = useCallback(async (): Promise<void> => {
    try {
      // Call the onForceUpdate callback if provided
      if (onForceUpdateRef.current) {
        onForceUpdateRef.current();
      }

      // Clear all caches if the Cache API is available
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Unregister all service workers if available
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }
      
      // Force reload with cache busting parameter
      window.location.href = window.location.origin + '?v=' + Date.now();
    } catch (error) {
      console.error('Error during force update:', error);
      // Fallback to simple reload if something fails
      window.location.reload();
    }
  }, []);

  /**
   * Check if an update is available based on version and build number
   */
  const checkForUpdates = useCallback(() => {
    // Get stored version info from localStorage
    const storedVersion = localStorage.getItem('app_version');
    const storedBuild = parseInt(localStorage.getItem('app_build') || '0', 10);
    
    setLastChecked(Date.now());
    
    // If no version info exists (legacy user) or build is very outdated
    if (!storedVersion || storedBuild < minBuildToForceUpdate) {
      setIsForceUpdate(true);
      return;
    }
    
    // Check if current version/build is different from provided version/build
    const needsUpdate = storedVersion !== version || storedBuild < build;
    setIsUpdateAvailable(needsUpdate);
    
    if (needsUpdate && onUpdateAvailableRef.current) {
      onUpdateAvailableRef.current();
    }
    
    // Update localStorage with latest version info
    localStorage.setItem('app_version', version);
    localStorage.setItem('app_build', build.toString());
    setCurrentVersion(version);
    setCurrentBuild(build);
  }, [version, build, minBuildToForceUpdate]);
  
  // Run check on mount and set up service worker message listener
  useEffect(() => {
    checkForUpdates();
    
    // Listen for service worker update messages
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === 'SW_UPDATED') {
          setIsUpdateAvailable(true);
          if (onUpdateAvailableRef.current) {
            onUpdateAvailableRef.current();
          }
        }
      };
      
      navigator.serviceWorker.addEventListener('message', messageHandler);
      return () => {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
      };
    }
  }, [checkForUpdates]);
  
  // Also check for updates when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkForUpdates]);

  return {
    currentVersion,
    currentBuild,
    isUpdateAvailable,
    isForceUpdate,
    lastChecked,
    forceUpdate,
    checkForUpdates,
  };
}

export default useVersionManager;
