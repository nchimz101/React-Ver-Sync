"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCacheUpdateManager = exports.useVersionManager = exports.UpdateNotification = exports.ForceUpdateDetector = void 0;
// Export all components and hooks
var ForceUpdateDetector_1 = __importDefault(require("./components/ForceUpdateDetector"));
exports.ForceUpdateDetector = ForceUpdateDetector_1.default;
var UpdateNotification_1 = __importDefault(require("./components/UpdateNotification"));
exports.UpdateNotification = UpdateNotification_1.default;
var useVersionManager_1 = __importDefault(require("./hooks/useVersionManager"));
exports.useVersionManager = useVersionManager_1.default;
var CacheUpdateManager_1 = __importDefault(require("./utils/CacheUpdateManager"));
exports.useCacheUpdateManager = CacheUpdateManager_1.default;
// For CommonJS compatibility
exports.default = {
    ForceUpdateDetector: ForceUpdateDetector_1.default,
    UpdateNotification: UpdateNotification_1.default,
    useVersionManager: useVersionManager_1.default,
    useCacheUpdateManager: CacheUpdateManager_1.default,
};
