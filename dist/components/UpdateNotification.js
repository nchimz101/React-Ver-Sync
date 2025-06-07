"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var useVersionManager_1 = __importDefault(require("../hooks/useVersionManager"));
var CacheUpdateManager_1 = __importDefault(require("../utils/CacheUpdateManager"));
/**
 * Component that shows a notification when an update is available
 */
var UpdateNotification = function (_a) {
    var version = _a.version, build = _a.build, minBuildToForceUpdate = _a.minBuildToForceUpdate, onForceUpdate = _a.onForceUpdate, onUpdateAvailable = _a.onUpdateAvailable, onUpdateComplete = _a.onUpdateComplete, _b = _a.countdownDuration, countdownDuration = _b === void 0 ? 60000 : _b, _c = _a.maxPostponeCount, maxPostponeCount = _c === void 0 ? 3 : _c, _d = _a.show, show = _d === void 0 ? true : _d, renderNotification = _a.renderNotification;
    var _e = (0, useVersionManager_1.default)({
        version: version,
        build: build,
        minBuildToForceUpdate: minBuildToForceUpdate,
        onForceUpdate: onForceUpdate,
        onUpdateAvailable: onUpdateAvailable,
        onUpdateComplete: onUpdateComplete,
    }), isUpdateAvailable = _e.isUpdateAvailable, forceUpdate = _e.forceUpdate, currentVersion = _e.currentVersion;
    var _f = (0, CacheUpdateManager_1.default)({
        isUpdateAvailable: isUpdateAvailable,
        onUpdateConfirmed: forceUpdate,
        countdownDuration: countdownDuration,
        maxPostponeCount: maxPostponeCount,
    }), isUpdateInProgress = _f.isUpdateInProgress, isPostponed = _f.isPostponed, countdownSeconds = _f.countdownSeconds, handleUpdate = _f.handleUpdate, postponeUpdate = _f.postponeUpdate, startAutoUpdateProcess = _f.startAutoUpdateProcess;
    // Start auto update process when an update is available
    (0, react_1.useEffect)(function () {
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
        return (react_1.default.createElement(react_1.default.Fragment, null, renderNotification({
            isUpdateAvailable: isUpdateAvailable,
            isUpdateInProgress: isUpdateInProgress,
            isPostponed: isPostponed,
            countdownSeconds: countdownSeconds,
            handleUpdate: handleUpdate,
            postponeUpdate: postponeUpdate,
            version: currentVersion,
        })));
    }
    // Default notification UI
    return (react_1.default.createElement("div", { style: {
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
        } },
        react_1.default.createElement("style", null, "\n        @keyframes slideIn {\n          from { transform: translateY(100%); opacity: 0; }\n          to { transform: translateY(0); opacity: 1; }\n        }\n      "),
        react_1.default.createElement("h3", { style: { margin: '0 0 8px 0', fontSize: 16 } }, "Update Available"),
        react_1.default.createElement("p", { style: { margin: '0 0 16px 0', fontSize: 14, color: '#666' } }, isUpdateInProgress
            ? 'Installing update...'
            : "A new version (".concat(version, ") is available. Install now?")),
        !isUpdateInProgress && (react_1.default.createElement("div", { style: { display: 'flex', justifyContent: 'space-between' } },
            react_1.default.createElement("button", { onClick: postponeUpdate, disabled: isUpdateInProgress, style: {
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: '#666',
                    outline: 'none',
                } },
                "Later",
                countdownSeconds > 0 && !isPostponed && " (".concat(countdownSeconds, "s)")),
            react_1.default.createElement("button", { onClick: function () { return handleUpdate(); }, disabled: isUpdateInProgress, style: {
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 'bold',
                    outline: 'none',
                } }, "Update Now")))));
};
exports.default = UpdateNotification;
