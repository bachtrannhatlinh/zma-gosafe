import React from 'react';
import { Box } from 'zmp-ui';

const SkeletonItem = ({ width, height = "h-4", className = "" }) => (
  <Box className={`${height} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded ${width} animate-pulse relative overflow-hidden ${className}`}>
    <Box className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer" />
  </Box>
);

const LoadingSkeleton = () => (
  <Box
    className="px-4 relative bg-white shadow-sm"
    style={{ paddingTop: "max(env(safe-area-inset-top), 44px)" }}
  >
    <Box className="flex items-center space-x-3 py-4">
      <SkeletonItem width="w-10" height="h-10" className="rounded-full" />
      <Box className="flex-1 space-y-2">
        <SkeletonItem width="w-32" height="h-3" />
        <SkeletonItem width="w-48" height="h-4" />
      </Box>
    </Box>
  </Box>
);

export default LoadingSkeleton;