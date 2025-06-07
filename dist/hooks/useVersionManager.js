"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
/**
 * Hook for managing version information and update processes
 */
function useVersionManager(_a) {
    var _this = this;
    var version = _a.version, build = _a.build, _b = _a.minBuildToForceUpdate, minBuildToForceUpdate = _b === void 0 ? 150 : _b, onForceUpdate = _a.onForceUpdate, onUpdateAvailable = _a.onUpdateAvailable, onUpdateComplete = _a.onUpdateComplete;
    var _c = (0, react_1.useState)(localStorage.getItem('app_version') || version), currentVersion = _c[0], setCurrentVersion = _c[1];
    var _d = (0, react_1.useState)(parseInt(localStorage.getItem('app_build') || '0', 10) || build), currentBuild = _d[0], setCurrentBuild = _d[1];
    var _e = (0, react_1.useState)(false), isUpdateAvailable = _e[0], setIsUpdateAvailable = _e[1];
    var _f = (0, react_1.useState)(false), isForceUpdate = _f[0], setIsForceUpdate = _f[1];
    var _g = (0, react_1.useState)(Date.now()), lastChecked = _g[0], setLastChecked = _g[1];
    // Store the callbacks in refs to avoid dependency issues
    var onForceUpdateRef = (0, react_1.useRef)(onForceUpdate);
    var onUpdateAvailableRef = (0, react_1.useRef)(onUpdateAvailable);
    var onUpdateCompleteRef = (0, react_1.useRef)(onUpdateComplete);
    (0, react_1.useEffect)(function () {
        onForceUpdateRef.current = onForceUpdate;
        onUpdateAvailableRef.current = onUpdateAvailable;
        onUpdateCompleteRef.current = onUpdateComplete;
    }, [onForceUpdate, onUpdateAvailable, onUpdateComplete]);
    /**
     * Force update by clearing caches and reloading the application
     */
    var forceUpdate = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var cacheNames, registrations, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    // Call the onForceUpdate callback if provided
                    if (onForceUpdateRef.current) {
                        onForceUpdateRef.current();
                    }
                    if (!('caches' in window)) return [3 /*break*/, 3];
                    return [4 /*yield*/, caches.keys()];
                case 1:
                    cacheNames = _a.sent();
                    return [4 /*yield*/, Promise.all(cacheNames.map(function (name) { return caches.delete(name); }))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (!('serviceWorker' in navigator)) return [3 /*break*/, 6];
                    return [4 /*yield*/, navigator.serviceWorker.getRegistrations()];
                case 4:
                    registrations = _a.sent();
                    return [4 /*yield*/, Promise.all(registrations.map(function (reg) { return reg.unregister(); }))];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    // Force reload with cache busting parameter
                    window.location.href = window.location.origin + '?v=' + Date.now();
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error('Error during force update:', error_1);
                    // Fallback to simple reload if something fails
                    window.location.reload();
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); }, []);
    /**
     * Check if an update is available based on version and build number
     */
    var checkForUpdates = (0, react_1.useCallback)(function () {
        // Get stored version info from localStorage
        var storedVersion = localStorage.getItem('app_version');
        var storedBuild = parseInt(localStorage.getItem('app_build') || '0', 10);
        setLastChecked(Date.now());
        // If no version info exists (legacy user) or build is very outdated
        if (!storedVersion || storedBuild < minBuildToForceUpdate) {
            setIsForceUpdate(true);
            return;
        }
        // Check if current version/build is different from provided version/build
        var needsUpdate = storedVersion !== version || storedBuild < build;
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
    (0, react_1.useEffect)(function () {
        checkForUpdates();
        // Listen for service worker update messages
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            var messageHandler_1 = function (event) {
                if (event.data && event.data.type === 'SW_UPDATED') {
                    setIsUpdateAvailable(true);
                    if (onUpdateAvailableRef.current) {
                        onUpdateAvailableRef.current();
                    }
                }
            };
            navigator.serviceWorker.addEventListener('message', messageHandler_1);
            return function () {
                navigator.serviceWorker.removeEventListener('message', messageHandler_1);
            };
        }
    }, [checkForUpdates]);
    // Also check for updates when page becomes visible again
    (0, react_1.useEffect)(function () {
        var handleVisibilityChange = function () {
            if (document.visibilityState === 'visible') {
                checkForUpdates();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return function () {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [checkForUpdates]);
    return {
        currentVersion: currentVersion,
        currentBuild: currentBuild,
        isUpdateAvailable: isUpdateAvailable,
        isForceUpdate: isForceUpdate,
        lastChecked: lastChecked,
        forceUpdate: forceUpdate,
        checkForUpdates: checkForUpdates,
    };
}
exports.default = useVersionManager;
