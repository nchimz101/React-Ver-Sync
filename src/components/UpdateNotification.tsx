import React, { useEffect } from 'react';
import useVersionManager, { VersionManagerOptions } from '../hooks/useVersionManager';
import useCacheUpdateManager from '../utils/CacheUpdateManager';

export interface UpdateNotificationProps extends VersionManagerOptions {
  /**
   * Render prop for custom notification UI
   */
  renderNotification?: (props: {
    isUpdateAvailable: boolean;
    isUpdateInProgress: boolean;
    isPostponed: boolean;
    countdownSeconds: number;
    handleUpdate: () => Promise<void>;
    postponeUpdate: () => void;
    version: string;
  }) => React.ReactNode;
  
  /**
   * Time in milliseconds before auto-updating
   */
  countdownDuration?: number;
  
  /**
   * Maximum number of times user can postpone the update
   */
  maxPostponeCount?: number;
  
  /**
   * Whether to show the notification
   */
  show?: boolean;
}

/**
 * Component that shows a notification when an update is available
 */
const UpdateNotification: React.FC<UpdateNotificationProps> = ({
  version,
  build,
  minBuildToForceUpdate,
  onForceUpdate,
  onUpdateAvailable,
  onUpdateComplete,
  countdownDuration = 60000,
  maxPostponeCount = 3,
  show = true,
  renderNotification,
}) => {
  const { 
    isUpdateAvailable,
    forceUpdate,
    currentVersion,
  } = useVersionManager({
    version,
    build,
    minBuildToForceUpdate,
    onForceUpdate,
    onUpdateAvailable,
    onUpdateComplete,
  });
  
  const {
    isUpdateInProgress,
    isPostponed,
    countdownSeconds,
    handleUpdate,
    postponeUpdate,
    startAutoUpdateProcess,
  } = useCacheUpdateManager({
    isUpdateAvailable,
    onUpdateConfirmed: forceUpdate,
    countdownDuration,
    maxPostponeCount,
  });

  // Start auto update process when an update is available
  useEffect(() => {
    if (isUpdateAvailable && !isPostponed && !isUpdateInProgress) {
      startAutoUpdateProcess();
    }
  }, [isUpdateAvailable, isPostponed, isUpdateInProgress, startAutoUpdateProcess]);

  // Don't render anything if no update available or shown is false
  if (!show || (!isUpdateAvailable && !isUpdateInProgress)) {
    return null;
  }

  // Use custom render props if provided
  if (renderNotification) {
    return (
      <>
        {renderNotification({
          isUpdateAvailable,
          isUpdateInProgress,
          isPostponed,
          countdownSeconds,
          handleUpdate,
          postponeUpdate,
          version: currentVersion,
        })}
      </>
    );
  }

  // Default notification UI
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      maxWidth: 400,
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      borderRadius: 8,
      padding: '16px 20px',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease',
    }}>
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <h3 style={{ margin: '0 0 8px 0', fontSize: 16 }}>
        Update Available
      </h3>
      <p style={{ margin: '0 0 16px 0', fontSize: 14, color: '#666' }}>
        {isUpdateInProgress 
          ? 'Installing update...' 
          : `A new version (${version}) is available. Install now?`}
      </p>
      {!isUpdateInProgress && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={postponeUpdate}
            disabled={isUpdateInProgress}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: 14,
              color: '#666',
              outline: 'none',
            }}
          >
            Later
            {countdownSeconds > 0 && !isPostponed && ` (${countdownSeconds}s)`}
          </button>
          <button
            onClick={() => handleUpdate()}
            disabled={isUpdateInProgress}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 'bold',
              outline: 'none',
            }}
          >
            Update Now
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateNotification;
