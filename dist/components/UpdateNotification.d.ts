import React from 'react';
import { VersionManagerOptions } from '../hooks/useVersionManager';
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
declare const UpdateNotification: React.FC<UpdateNotificationProps>;
export default UpdateNotification;
