import React from 'react';
import { UpdateNotification } from '../src';
import './CustomUpdateNotification.css'; // You'll need to create this CSS file

interface CustomUpdateNotificationProps {
  version: string;
  build: number;
  appName?: string;
  logoUrl?: string;
}

/**
 * Custom styled update notification component
 */
const CustomUpdateNotification: React.FC<CustomUpdateNotificationProps> = ({
  version,
  build,
  appName = 'Your App',
  logoUrl,
}) => {
  return (
    <UpdateNotification
      version={version}
      build={build}
      countdownDuration={60000}
      renderNotification={({
        isUpdateAvailable,
        isUpdateInProgress,
        isPostponed,
        countdownSeconds,
        handleUpdate,
        postponeUpdate,
      }) => (
        <div className="custom-update-notification">
          <div className="update-notification-header">
            {logoUrl && (
              <img
                src={logoUrl}
                alt={`${appName} logo`}
                className="update-logo"
              />
            )}
            <h3>{isUpdateInProgress ? 'Updating...' : 'Update Available'}</h3>
          </div>

          <div className="update-notification-content">
            {isUpdateInProgress ? (
              <>
                <div className="loading-spinner"></div>
                <p>Installing the latest version...</p>
              </>
            ) : (
              <>
                <p className="update-message">
                  A new version of <strong>{appName}</strong> is available.
                </p>
                <p className="update-version">Version {version}</p>
                
                {!isPostponed && countdownSeconds > 0 && (
                  <div className="countdown-container">
                    <div 
                      className="countdown-bar"
                      style={{
                        width: `${(countdownSeconds / 60) * 100}%`
                      }}
                    ></div>
                    <p className="countdown-text">
                      Auto-updating in {countdownSeconds}s
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {!isUpdateInProgress && (
            <div className="update-notification-actions">
              <button
                className="postpone-button"
                onClick={postponeUpdate}
                disabled={isUpdateInProgress}
              >
                Later
              </button>
              <button
                className="update-button"
                onClick={() => handleUpdate()}
                disabled={isUpdateInProgress}
              >
                Update Now
              </button>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default CustomUpdateNotification;
