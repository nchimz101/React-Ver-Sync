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
 * Hook for managing cache update processes with user activity detection
 */
function useCacheUpdateManager(_a) {
    var _this = this;
    var isUpdateAvailable = _a.isUpdateAvailable, onUpdateConfirmed = _a.onUpdateConfirmed, onUpdatePostponed = _a.onUpdatePostponed, _b = _a.countdownDuration, countdownDuration = _b === void 0 ? 60000 : _b, _c = _a.inactivityThreshold, inactivityThreshold = _c === void 0 ? 30000 : _c, _d = _a.maxPostponeCount, maxPostponeCount = _d === void 0 ? 3 : _d;
    var _e = (0, react_1.useState)(false), isUpdateInProgress = _e[0], setIsUpdateInProgress = _e[1];
    var _f = (0, react_1.useState)(false), isPostponed = _f[0], setIsPostponed = _f[1];
    var _g = (0, react_1.useState)(0), postponeCount = _g[0], setPostponeCount = _g[1];
    var _h = (0, react_1.useState)(Math.round(countdownDuration / 1000)), countdownSeconds = _h[0], setCountdownSeconds = _h[1];
    // Track user activity
    var lastActivityRef = (0, react_1.useRef)(Date.now());
    var countdownIntervalRef = (0, react_1.useRef)(null);
    // Reset state when update availability changes
    (0, react_1.useEffect)(function () {
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
    (0, react_1.useEffect)(function () {
        var updateActivityTimestamp = function () {
            lastActivityRef.current = Date.now();
        };
        // Track user interactions
        var events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove'];
        events.forEach(function (event) {
            window.addEventListener(event, updateActivityTimestamp);
        });
        return function () {
            events.forEach(function (event) {
                window.removeEventListener(event, updateActivityTimestamp);
            });
        };
    }, []);
    /**
     * Perform the update action
     */
    var handleUpdate = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var registrations, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isUpdateAvailable) return [3 /*break*/, 9];
                    setIsUpdateInProgress(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    if (!onUpdateConfirmed) return [3 /*break*/, 3];
                    return [4 /*yield*/, onUpdateConfirmed()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 7];
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
                    window.location.reload();
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error('Error during update:', error_1);
                    setIsUpdateInProgress(false);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); }, [isUpdateAvailable, onUpdateConfirmed]);
    /**
     * Postpone the update
     */
    var postponeUpdate = (0, react_1.useCallback)(function () {
        if (postponeCount < maxPostponeCount) {
            setIsPostponed(true);
            setPostponeCount(function (prev) { return prev + 1; });
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            if (onUpdatePostponed) {
                onUpdatePostponed();
            }
        }
        else {
            // Forced update if max postpone count reached
            handleUpdate();
        }
    }, [postponeCount, maxPostponeCount, handleUpdate, onUpdatePostponed]);
    /**
     * Start the automatic update process with user activity detection
     */
    var startAutoUpdateProcess = (0, react_1.useCallback)(function () {
        if (!isUpdateAvailable || isUpdateInProgress || isPostponed) {
            return;
        }
        // Check if user is active before auto-updating
        var timeSinceActivity = Date.now() - lastActivityRef.current;
        if (timeSinceActivity < inactivityThreshold) {
            // User is active, show countdown
            setCountdownSeconds(Math.round(countdownDuration / 1000));
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
            }
            countdownIntervalRef.current = setInterval(function () {
                setCountdownSeconds(function (prev) {
                    if (prev <= 1) {
                        // Time's up, check inactivity again before updating
                        var currentTimeSinceActivity = Date.now() - lastActivityRef.current;
                        if (currentTimeSinceActivity < inactivityThreshold) {
                            postponeUpdate();
                            return Math.round(countdownDuration / 1000);
                        }
                        else {
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
        }
        else {
            // User is inactive, update immediately
            handleUpdate();
        }
        return function () {
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
    (0, react_1.useEffect)(function () {
        return function () {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
        };
    }, []);
    return {
        isUpdateInProgress: isUpdateInProgress,
        isPostponed: isPostponed,
        postponeCount: postponeCount,
        countdownSeconds: countdownSeconds,
        handleUpdate: handleUpdate,
        postponeUpdate: postponeUpdate,
        startAutoUpdateProcess: startAutoUpdateProcess,
    };
}
exports.default = useCacheUpdateManager;
