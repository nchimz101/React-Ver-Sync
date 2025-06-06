import React from 'react';
import { ForceUpdateDetector, UpdateNotification } from '../src';

/**
 * Example App component showing how to implement versynch
 */
const App: React.FC = () => {
  // App version info - update these when releasing a new version
  const appVersion = '2.1.0';
  const buildNumber = 210;
  
  return (
    <ForceUpdateDetector
      version={appVersion}
      build={buildNumber}
      minBuildToForceUpdate={150}
      onForceUpdate={() => console.log('Force updating application...')}
      updateDelay={3000}
    >
      <div className="app">
        <header className="app-header">
          <h1>My Application</h1>
          <span className="version-badge">v{appVersion}</span>
        </header>
        
        <main className="app-content">
          {/* Your application content goes here */}
          <h2>Welcome to the app!</h2>
          <p>This application uses versynch for automatic version detection and updates.</p>
        </main>
        
        <footer>
          <p>&copy; 2025 My Company</p>
        </footer>
      </div>
      
      {/* Notification will appear when updates are available */}
      <UpdateNotification
        version={appVersion}
        build={buildNumber}
        countdownDuration={60000} // 60 seconds
        maxPostponeCount={3}
      />
    </ForceUpdateDetector>
  );
};

export default App;
