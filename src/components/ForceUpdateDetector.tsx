import React, { useEffect } from 'react';
import useVersionManager, { VersionManagerOptions } from '../hooks/useVersionManager';

export interface ForceUpdateDetectorProps extends VersionManagerOptions {
  children?: React.ReactNode;
  updateDelay?: number;
  showFallbackUI?: boolean;
  fallbackUI?: React.ReactNode;
}

/**
 * Component that detects outdated app versions and forces updates
 * Place this at the root of your app for immediate detection
 */
const ForceUpdateDetector: React.FC<ForceUpdateDetectorProps> = ({
  children,
  version,
  build,
  minBuildToForceUpdate,
  onForceUpdate,
  onUpdateAvailable,
  onUpdateComplete,
  updateDelay = 3000,
  showFallbackUI = true,
  fallbackUI = (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: '#f5f5f5', 
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: 20
    }}>
      <h2>Updating application...</h2>
      <p>A new version is being installed.</p>
      <p>This may take a few moments.</p>
    </div>
  ),
}) => {
  const { 
    isForceUpdate,
    forceUpdate
  } = useVersionManager({
    version,
    build,
    minBuildToForceUpdate,
    onForceUpdate,
    onUpdateAvailable,
    onUpdateComplete,
  });

  // Trigger force update with a delay to allow UI to render
  useEffect(() => {
    if (isForceUpdate) {
      const timer = setTimeout(() => {
        forceUpdate();
      }, updateDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isForceUpdate, forceUpdate, updateDelay]);

  // Show loading UI if force update is in progress
  if (isForceUpdate && showFallbackUI) {
    return <>{fallbackUI}</>;
  }

  return <>{children}</>;
};

export default ForceUpdateDetector;
