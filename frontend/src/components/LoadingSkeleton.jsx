import React from 'react';

const LoadingSkeleton = ({ rows = 5 }) => {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-3/4"></div>
      ))}
    </div>
  );
};

const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
      ))}
    </div>
  );
};

export { LoadingSkeleton, CardSkeleton };
