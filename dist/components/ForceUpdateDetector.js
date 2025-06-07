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
/**
 * Component that detects outdated app versions and forces updates
 * Place this at the root of your app for immediate detection
 */
var ForceUpdateDetector = function (_a) {
    var children = _a.children, version = _a.version, build = _a.build, minBuildToForceUpdate = _a.minBuildToForceUpdate, onForceUpdate = _a.onForceUpdate, onUpdateAvailable = _a.onUpdateAvailable, onUpdateComplete = _a.onUpdateComplete, _b = _a.updateDelay, updateDelay = _b === void 0 ? 3000 : _b, _c = _a.showFallbackUI, showFallbackUI = _c === void 0 ? true : _c, _d = _a.fallbackUI, fallbackUI = _d === void 0 ? (react_1.default.createElement("div", { style: {
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
        } },
        react_1.default.createElement("h2", null, "Updating application..."),
        react_1.default.createElement("p", null, "A new version is being installed."),
        react_1.default.createElement("p", null, "This may take a few moments."))) : _d;
    var _e = (0, useVersionManager_1.default)({
        version: version,
        build: build,
        minBuildToForceUpdate: minBuildToForceUpdate,
        onForceUpdate: onForceUpdate,
        onUpdateAvailable: onUpdateAvailable,
        onUpdateComplete: onUpdateComplete,
    }), isForceUpdate = _e.isForceUpdate, forceUpdate = _e.forceUpdate;
    // Trigger force update with a delay to allow UI to render
    (0, react_1.useEffect)(function () {
        if (isForceUpdate) {
            var timer_1 = setTimeout(function () {
                forceUpdate();
            }, updateDelay);
            return function () { return clearTimeout(timer_1); };
        }
    }, [isForceUpdate, forceUpdate, updateDelay]);
    // Show loading UI if force update is in progress
    if (isForceUpdate && showFallbackUI) {
        return react_1.default.createElement(react_1.default.Fragment, null, fallbackUI);
    }
    return react_1.default.createElement(react_1.default.Fragment, null, children);
};
exports.default = ForceUpdateDetector;
