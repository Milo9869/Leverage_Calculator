// src/components/ui/alert.jsx
import React from 'react';

export const Alert = ({ children }) => (
  <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
    {children}
  </div>
);

export const AlertDescription = ({ children }) => (
  <p className="text-sm text-red-700">
    {children}
  </p>
);
