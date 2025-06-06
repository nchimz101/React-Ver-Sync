import { useState, useCallback, useEffect, useRef } from 'react';

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
function useCacheUpdateManager({
  isUpdateAvailable,
  onUpdateConfirmed,
  onUpdatePostponed,
  countdownDuration = 60000,
  inactivityThreshold = 30000,
  maxPostponeCount = 3,
}: CacheUpdateManagerOptions): CacheUpdateManagerResult {
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [isPostponed, setIsPostponed] = useState(false);
  const [postponeCount, setPostponeCount] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(Math.round(countdownDuration / 1000));
  
  // Track user activity
  const lastActivityRef = useRef(Date.now());
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Reset state when update availability changes
  useEffect(() => {
    if (!isUpdateAvailable) {
      setIsUpdateInProgress(false);
      setIsPostponed(false);
      setPostponeCount(0);
      setCountdownSeconds(Math.round(countdownDuration / 1000));
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    }
  }, [isUpdateAvailable, countdownDuration]);
  
  // User activity tracking
  useEffect(() => {
    const updateActivityTimestamp = () => {
      lastActivityRef.current = Date.now();
    };
    
    // Track user interactions
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove'];
    events.forEach(event => {
      window.addEventListener(event, updateActivityTimestamp);
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivityTimestamp);
      });
    };
  }, []);

  /**
   * Perform the update action
   */
  const handleUpdate = useCallback(async () => {
    if (isUpdateAvailable) {
      setIsUpdateInProgress(true);
      
      try {
        if (onUpdateConfirmed) {
          await onUpdateConfirmed();
        } else {
          // Default behavior if no handler provided
          if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(reg => reg.unregister()));
          }
          
          window.location.reload();
        }
      } catch (error) {
        console.error('Error during update:', error);
        setIsUpdateInProgress(false);
      }
    }
  }, [isUpdateAvailable, onUpdateConfirmed]);

  /**
   * Postpone the update
   */
  const postponeUpdate = useCallback(() => {
    if (postponeCount < maxPostponeCount) {
      setIsPostponed(true);
      setPostponeCount(prev => prev + 1);
      
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      
      if (onUpdatePostponed) {
        onUpdatePostponed();
      }
    } else {
      // Forced update if max postpone count reached
      handleUpdate();
    }
  }, [postponeCount, maxPostponeCount, handleUpdate, onUpdatePostponed]);

  /**
   * Start the automatic update process with user activity detection
   */
  const startAutoUpdateProcess = useCallback(() => {
    if (!isUpdateAvailable || isUpdateInProgress || isPostponed) {
      return;
    }
    
    // Check if user is active before auto-updating
    const timeSinceActivity = Date.now() - lastActivityRef.current;
    if (timeSinceActivity < inactivityThreshold) {
      // User is active, show countdown
      setCountdownSeconds(Math.round(countdownDuration / 1000));
      
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      
      countdownIntervalRef.current = setInterval(() => {
        setCountdownSeconds(prev => {
          if (prev <= 1) {
            // Time's up, check inactivity again before updating
            const currentTimeSinceActivity = Date.now() - lastActivityRef.current;
            if (currentTimeSinceActivity < inactivityThreshold) {
              postponeUpdate();
              return Math.round(countdownDuration / 1000);
            } else {
              // User is inactive, trigger update
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
              }
              handleUpdate();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // User is inactive, update immediately
      handleUpdate();
    }
    
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [
    isUpdateAvailable,
    isUpdateInProgress,
    isPostponed,
    inactivityThreshold,
    countdownDuration,
    handleUpdate,
    postponeUpdate,
  ]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, []);

  return {
    isUpdateInProgress,
    isPostponed,
    postponeCount,
    countdownSeconds,
    handleUpdate,
    postponeUpdate,
    startAutoUpdateProcess,
  };
}

export default useCacheUpdateManager;
