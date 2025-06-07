# versynch

> The most reliable auto-update & version sync solution for React + PWA apps

![npm](https://img.shields.io/npm/v/versynch)
![License](https://img.shields.io/npm/l/versynch)

**🎉 NOW LIVE ON NPM! Install with: `npm install versynch`**

`versynch` is a comprehensive solution for managing version control and force-updating outdated React applications. It solves the problem of users getting stuck with stale cached versions, especially in PWA (Progressive Web App) environments.

## ✨ Features

- **Force Update Detection System**
  - Detects legacy versions automatically on app load
  - Forces immediate cache clearing and update for severely outdated versions
  - Shows update notifications and handles the process smoothly

- **Version Management System**
  - Full version tracking with semantic versioning support
  - Build numbers for precise version control
  - Automatic detection of users on old versions

- **Smart Update Experience**
  - Detects user activity to avoid interrupting work
  - Background updates when users are inactive
  - Configurable countdown timers and postpone options

- **Reliable Cache Busting**
  - Aggressive cache clearing for legacy users
  - Service worker unregistration for clean slate
  - Timestamp-based URL parameters for cache busting

## 🚀 Installation

The package is now available on npm! Install it using your preferred package manager:

```bash
# Using npm
npm install versynch

# Using yarn
yarn add versynch

# Using pnpm
pnpm add versynch
```

## 📋 Requirements

- React 16.8+ (uses hooks)
- TypeScript (optional but recommended)
- For full functionality, your app should use service workers

## 🧩 Usage

### Basic Setup

```tsx
import React from 'react';
import { ForceUpdateDetector, UpdateNotification } from 'versynch';

const App: React.FC = () => {
  return (
    <>
      <ForceUpdateDetector
        version="2.1.0"
        build={210}
        minBuildToForceUpdate={150}
        onForceUpdate={() => console.log("Force updating...")}
      >
        <div className="app-content">
          {/* Your app content */}
        </div>
        
        <UpdateNotification 
          version="2.1.0"
          build={210}
        />
      </ForceUpdateDetector>
    </>
  );
};

export default App;
```

### Using the hooks directly

```tsx
import React from 'react';
import { useVersionManager, useCacheUpdateManager } from 'versynch';

const AppVersionInfo: React.FC = () => {
  const { 
    currentVersion, 
    currentBuild,
    isUpdateAvailable,
    isForceUpdate,
    forceUpdate 
  } = useVersionManager({
    version: '2.1.0',
    build: 210
  });
  
  const {
    isUpdateInProgress,
    countdownSeconds,
    handleUpdate,
    postponeUpdate
  } = useCacheUpdateManager({
    isUpdateAvailable,
    onUpdateConfirmed: forceUpdate
  });
  
  return (
    <div>
      <h2>Current Version: {currentVersion}</h2>
      <p>Build: {currentBuild}</p>
      
      {isUpdateAvailable && (
        <div>
          <p>Update available! Installing in {countdownSeconds} seconds.</p>
          <button onClick={handleUpdate}>Update now</button>
          <button onClick={postponeUpdate}>Later</button>
        </div>
      )}
    </div>
  );
};
```

### Service Worker Integration

For the best experience, enhance your service worker with version broadcasting:

```js
// In your service worker (sw.js)
const APP_VERSION = '2.1.0';
const BUILD_NUMBER = 210;

// On activation, notify all clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SW_UPDATED',
          version: APP_VERSION,
          timestamp: Date.now()
        });
      });
    })
  );
});
```

## ⚙️ API Reference

### Components

#### `<ForceUpdateDetector>`

Core component that detects outdated app versions and forces updates.

```tsx
<ForceUpdateDetector
  version="2.1.0"              // Current app version
  build={210}                  // Current build number
  minBuildToForceUpdate={150}  // Min build number that's acceptable
  updateDelay={3000}           // Delay before forcing update (ms)
  onForceUpdate={() => {}}     // Callback when force update begins
  onUpdateAvailable={() => {}} // Callback when update detected
  onUpdateComplete={() => {}}  // Callback when update finishes
  showFallbackUI={true}        // Whether to show loading UI
  fallbackUI={<CustomLoader />} // Custom loading component
>
  {/* Your app content */}
</ForceUpdateDetector>
```

#### `<UpdateNotification>`

Component that shows a notification when an update is available.

```tsx
<UpdateNotification
  version="2.1.0"              // Current app version
  build={210}                  // Current build number
  countdownDuration={60000}    // Countdown time before auto-update (ms)
  maxPostponeCount={3}         // Max times user can postpone update
  show={true}                  // Whether to show notification
  renderNotification={(props) => (
    // Custom notification UI
    <CustomNotification {...props} />
  )}
/>
```

### Hooks

#### `useVersionManager(options)`

Manages version information and update processes.

```ts
const {
  currentVersion,      // Current stored version
  currentBuild,        // Current stored build
  isUpdateAvailable,   // Whether update is available
  isForceUpdate,       // Whether force update is needed
  lastChecked,         // Timestamp of last check
  forceUpdate,         // Function to force update
  checkForUpdates      // Function to check for updates
} = useVersionManager({
  version: '2.1.0',             // Current app version
  build: 210,                   // Current build number
  minBuildToForceUpdate: 150,   // Min build number that's acceptable
  onForceUpdate: () => {},      // Callback when force update begins
  onUpdateAvailable: () => {},  // Callback when update available
  onUpdateComplete: () => {}    // Callback when update completes
});
```

#### `useCacheUpdateManager(options)`

Manages cache update processes with user activity detection.

```ts
const {
  isUpdateInProgress,    // Whether update is in progress
  isPostponed,           // Whether update is postponed
  postponeCount,         // Number of times update postponed
  countdownSeconds,      // Seconds left in countdown
  handleUpdate,          // Function to handle update now
  postponeUpdate,        // Function to postpone update
  startAutoUpdateProcess // Start automatic update process
} = useCacheUpdateManager({
  isUpdateAvailable,              // Whether update is available
  onUpdateConfirmed: () => {},    // Callback when update confirmed
  onUpdatePostponed: () => {},    // Callback when update postponed
  countdownDuration: 60000,       // Countdown duration (ms)
  inactivityThreshold: 30000,     // User inactivity threshold (ms)
  maxPostponeCount: 3             // Max times user can postpone
});
```

## 🛠 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 🙌 Credits

Created by Nchimunya Munyama
