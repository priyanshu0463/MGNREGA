import React, { useState, useEffect } from 'react';

interface ConnectionStatusProps {
  isBackendAvailable: boolean | null;
}

export default function ConnectionStatus({ isBackendAvailable }: ConnectionStatusProps) {
  if (isBackendAvailable === null) {
    return null; // Don't show anything while checking
  }

  if (isBackendAvailable) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4 text-sm text-green-800 text-center">
        ✓ Connected to backend API
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mb-4 text-sm text-yellow-800 text-center">
      ⚠️ Using fallback mode - Backend unavailable, using cached data
    </div>
  );
}

