import React from 'react';
import { VersionManagerOptions } from '../hooks/useVersionManager';
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
declare const ForceUpdateDetector: React.FC<ForceUpdateDetectorProps>;
export default ForceUpdateDetector;
