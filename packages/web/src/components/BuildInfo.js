import React, { useState, useEffect } from 'react';

const BuildInfo = () => {
  const [buildInfo, setBuildInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to load build info from the build-info.txt file
    fetch('/build-info.txt')
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        throw new Error('Build info not found');
      })
      .then(text => {
        const info = {};
        text.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(': ');
          if (key && valueParts.length > 0) {
            info[key.trim()] = valueParts.join(': ').trim();
          }
        });
        setBuildInfo(info);
      })
      .catch(error => {
        console.log('Build info not available:', error.message);
        // Fallback to environment variables or git info
        setBuildInfo({
          'Build completed at': new Date().toLocaleString(),
          'Environment': process.env.NODE_ENV || 'development',
          'Version': process.env.REACT_APP_VERSION || '1.0.0'
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return null;
  }

  if (!buildInfo) {
    return null;
  }

  const commitHash = buildInfo['Commit'] ? buildInfo['Commit'].substring(0, 7) : null;

  return (
    <footer className="build-info-footer mt-auto py-2 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-12 text-center">
            <small className="text-muted">
              Prayer & Praise App v{process.env.REACT_APP_VERSION || '1.0.0'}
              {commitHash && (
                <span className="ms-2">
                  Build: {commitHash}
                </span>
              )}
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BuildInfo; 