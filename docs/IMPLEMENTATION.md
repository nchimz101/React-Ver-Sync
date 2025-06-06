# Developer Implementation Guide for versynch

This document provides step-by-step instructions for implementing `versynch` in your React application.

## Quick Start

### 1. Install the package

```bash
npm install versynch
# or
yarn add versynch
```

### 2. Wrap your app with ForceUpdateDetector

```tsx
// src/index.tsx or src/App.tsx
import React from 'react';
import { ForceUpdateDetector } from 'versynch';

function App() {
  return (
    <ForceUpdateDetector
      version="1.0.0"  // Your current app version
      build={100}      // Your current build number
      minBuildToForceUpdate={50} // Minimum build number before forcing update
    >
      {/* Your application content */}
      <YourAppComponent />
    </ForceUpdateDetector>
  );
}
```

### 3. Add UpdateNotification component

```tsx
// src/App.tsx
import React from 'react';
import { ForceUpdateDetector, UpdateNotification } from 'versynch';

function App() {
  const appVersion = "1.0.0";
  const buildNumber = 100;
  
  return (
    <ForceUpdateDetector
      version={appVersion}
      build={buildNumber}
      minBuildToForceUpdate={50}
    >
      {/* Your application content */}
      <YourAppComponent />
      
      {/* Update notification */}
      <UpdateNotification 
        version={appVersion}
        build={buildNumber}
        countdownDuration={60000} // 60 seconds
      />
    </ForceUpdateDetector>
  );
}
```

### 4. Enhance your service worker

Add version broadcasting to your service worker:

```js
// public/sw.js or wherever your service worker is located
const APP_VERSION = '1.0.0'; // Keep in sync with your app
const BUILD_NUMBER = 100;    // Keep in sync with your app

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

## Advanced Configuration

### Custom Update Notification UI

```tsx
<UpdateNotification
  version={appVersion}
  build={buildNumber}
  renderNotification={({ 
    isUpdateAvailable, 
    isUpdateInProgress,
    countdownSeconds,
    handleUpdate,
    postponeUpdate
  }) => (
    <div className="custom-notification">
      <h3>Update Available</h3>
      <p>Version {appVersion} is ready to install.</p>
      <p>Installing in {countdownSeconds} seconds...</p>
      <div>
        <button onClick={postponeUpdate}>Later</button>
        <button onClick={handleUpdate}>Update Now</button>
      </div>
    </div>
  )}
/>
```

### Direct Hook Usage

For more granular control:

```tsx
import { useVersionManager, useCacheUpdateManager } from 'versynch';

function VersionControls() {
  const { 
    currentVersion,
    isUpdateAvailable,
    forceUpdate,
    checkForUpdates
  } = useVersionManager({
    version: '1.0.0',
    build: 100
  });
  
  const {
    countdownSeconds,
    handleUpdate,
    postponeUpdate
  } = useCacheUpdateManager({
    isUpdateAvailable,
    onUpdateConfirmed: forceUpdate
  });
  
  return (
    <div>
      {/* Your custom update UI */}
    </div>
  );
}
```

### Admin Panel Integration

```tsx
function AdminPanel() {
  const { 
    currentVersion,
    forceUpdate,
    checkForUpdates
  } = useVersionManager({
    version: '1.0.0',
    build: 100
  });
  
  return (
    <div className="admin-panel">
      <h2>Version Management</h2>
      <p>Current Version: {currentVersion}</p>
      
      <button onClick={checkForUpdates}>
        Check for Updates
      </button>
      
      <button onClick={forceUpdate}>
        Force Update All Users
      </button>
      
      {/* Version analytics could go here */}
    </div>
  );
}
```

## CI/CD Integration

### Automated Version Updates

Update version and build numbers automatically in CI/CD:

```bash
# Example script for CI/CD pipeline
#!/bin/bash

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")

# Calculate build number (e.g., from CI build number)
BUILD_NUMBER=$CI_BUILD_NUMBER

# Replace version and build in service worker
sed -i "s/const APP_VERSION = '.*'/const APP_VERSION = '$VERSION'/g" public/sw.js
sed -i "s/const BUILD_NUMBER = [0-9]*/const BUILD_NUMBER = $BUILD_NUMBER/g" public/sw.js

echo "Updated to version $VERSION (build $BUILD_NUMBER)"
```

## Best Practices

1. **Use semantic versioning** - Follow [semver.org](https://semver.org/) guidelines
2. **Increment build numbers** consistently - Even for patch releases
3. **Keep version info in sync** between app and service worker
4. **Test update paths** thoroughly - Simulate outdated clients
5. **Use feature detection** for browser APIs
6. **Add analytics** to track update success rates

## Troubleshooting

### Update Not Triggering
- Check that localStorage is writing/reading correctly
- Verify service worker registration and activation
- Ensure cache clearing is working

### Multiple Updates
- Check for race conditions between tabs
- Ensure version/build consistency

### UI Issues
- Style notification for mobile responsiveness
- Test on various screen sizes

## Version Checking Logic

Flow chart of version checking logic:

```
Start
  ├─ App loads
  │   └─ ForceUpdateDetector mounts
  │       ├─ Check localStorage for version info
  │       │   ├─ No version info found
  │       │   │   └─ Force update (legacy user)
  │       │   └─ Version info found
  │       │       ├─ Build < minBuildToForceUpdate
  │       │       │   └─ Force update (very old version)
  │       │       └─ Build >= minBuildToForceUpdate
  │       │           ├─ Version matches current
  │       │           │   └─ No update needed
  │       │           └─ Version doesn't match
  │       │               └─ Show update notification
  │       └─ Listen for service worker messages
  │           └─ On 'SW_UPDATED' message
  │               └─ Show update notification
  └─ End
```
