import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, Spinner } from "zmp-ui";

const PullToRefresh = ({ children, onRefresh, refreshing = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isRefreshTriggered, setIsRefreshTriggered] = useState(false);
  const containerRef = useRef(null);
  const refreshThreshold = 50; // Reduced threshold
  const maxDragDistance = 70; // Reduced max distance

  const handleTouchStart = useCallback(
    (e) => {
      const container = containerRef.current;
      if (!container) return;

      // Check if touch started on bottom navigation or other fixed elements
      const target = e.target;
      const isFixedElement =
        target.closest("[data-fixed-element]") ||
        target.closest(".fixed") ||
        target.closest('[style*="position: fixed"]') ||
        target.closest('[style*="z-index"]') ||
        target.closest("button") || // Detect buttons in bottom nav
        target.closest('[class*="bottom"]'); // Detect bottom navigation

      if (isFixedElement) {
        return; // Don't handle touch events on fixed elements
      }

      // Additional check: if touch starts in bottom 80px of screen, likely bottom nav
      const touchY = e.touches[0].clientY;
      const windowHeight = window.innerHeight;
      if (touchY > windowHeight - 100) {
        return; // Don't handle touch events near bottom
      }

      const scrollTop = container.scrollTop;

      // Only allow pull-to-refresh when at the top and not currently refreshing
      if (scrollTop <= 5 && !refreshing) { // Allow small scroll tolerance
        setStartY(e.touches[0].clientY);
        setIsDragging(true);
        setIsRefreshTriggered(false);
      }
    },
    [refreshing]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging || refreshing) return;

      // Check if touch is on fixed elements
      const target = e.target;
      const isFixedElement =
        target.closest("[data-fixed-element]") ||
        target.closest(".fixed") ||
        target.closest('[style*="position: fixed"]') ||
        target.closest('[style*="z-index"]') ||
        target.closest("button") ||
        target.closest('[class*="bottom"]');

      if (isFixedElement) {
        return; // Don't handle touch events on fixed elements
      }

      // Additional check: if current touch is in bottom area, stop dragging
      const touchY = e.touches[0].clientY;
      const windowHeight = window.innerHeight;
      if (touchY > windowHeight - 80) {
        setIsDragging(false);
        setDragDistance(0);
        return;
      }

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // Only allow downward drag when at the top of the scroll
      if (deltaY > 0) {
        const container = containerRef.current;
        if (container && container.scrollTop <= 5) { // Allow small scroll tolerance
          // Prevent default scroll behavior during pull-to-refresh
          e.preventDefault();
          e.stopPropagation();

          // Use rubber band effect - slower movement as distance increases
          const damping = deltaY < refreshThreshold ? 0.6 : 0.3;
          const newDistance = Math.min(deltaY * damping, maxDragDistance);

          setDragDistance(newDistance);
        } else {
          // If not at top, stop dragging
          setIsDragging(false);
          setDragDistance(0);
        }
      } else {
        // If dragging upward, reset
        setDragDistance(0);
      }
    },
    [isDragging, startY, refreshing, refreshThreshold, maxDragDistance]
  );

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;

    const shouldRefresh = dragDistance >= refreshThreshold && !refreshing;

    if (shouldRefresh && onRefresh) {
      setIsRefreshTriggered(true);
      onRefresh();
    }

    setIsDragging(false);

    // Smooth animation back to 0 if not refreshing
    if (!shouldRefresh) {
      setDragDistance(0);
    }

    setStartY(0);
  }, [isDragging, dragDistance, refreshThreshold, refreshing, onRefresh]);

  // Handle scroll events to ensure proper state management
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (container && container.scrollTop > 5) { // Allow small scroll tolerance
      // If scrolled down, ensure drag state is reset
      if (isDragging) {
        setIsDragging(false);
        setDragDistance(0);
      }
    }
  }, [isDragging]);

  // Reset states when refresh completes
  useEffect(() => {
    if (!refreshing && isRefreshTriggered) {
      const timer = setTimeout(() => {
        setDragDistance(0);
        setIsRefreshTriggered(false);
      }, 300); // Smooth transition back

      return () => clearTimeout(timer);
    }
  }, [refreshing, isRefreshTriggered]);

  // Cleanup function to reset states on unmount
  useEffect(() => {
    return () => {
      setIsDragging(false);
      setDragDistance(0);
      setIsRefreshTriggered(false);
    };
  }, []);

  // Add window event listeners to handle edge cases
  useEffect(() => {
    const handleWindowTouchEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragDistance(0);
      }
    };

    const handleWindowTouchCancel = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragDistance(0);
      }
    };

    // Additional listener to detect touches on bottom navigation
    const handleWindowTouchStart = (e) => {
      const target = e.target;
      const isBottomNav =
        target.closest("[data-fixed-element]") ||
        target.closest(".fixed") ||
        target.closest("button");

      if (isBottomNav && isDragging) {
        setIsDragging(false);
        setDragDistance(0);
      }
    };

    window.addEventListener("touchstart", handleWindowTouchStart);
    window.addEventListener("touchend", handleWindowTouchEnd);
    window.addEventListener("touchcancel", handleWindowTouchCancel);

    return () => {
      window.removeEventListener("touchstart", handleWindowTouchStart);
      window.removeEventListener("touchend", handleWindowTouchEnd);
      window.removeEventListener("touchcancel", handleWindowTouchCancel);
    };
  }, [isDragging]);

  const showRefreshIndicator =
    dragDistance > 0 || refreshing || isRefreshTriggered;
  const indicatorOpacity = refreshing
    ? 1
    : Math.min(dragDistance / refreshThreshold, 1);
  const shouldTriggerRefresh = dragDistance >= refreshThreshold;
  const indicatorHeight =
    refreshing || isRefreshTriggered ? refreshThreshold : dragDistance;

  // Ensure no transform when not actively pulling or refreshing
  const shouldShowTransform =
    showRefreshIndicator && (isDragging || refreshing || isRefreshTriggered);

  return (
    <Box className="relative w-full h-full overflow-hidden">
      {/* Pull-to-refresh indicator - Only visible when dragging or refreshing */}
      {showRefreshIndicator && (
        <Box
          className="absolute left-0 right-0 top-0 z-30 flex items-center justify-center bg-white"
          style={{
            height: `${indicatorHeight + 40}px`, // Add safe area for dynamic island
            opacity: indicatorOpacity,
            transition: isDragging ? "none" : "all 0.3s ease-out",
            paddingTop: "70px", // Safe area padding
          }}
        >
          <Box className="flex flex-col items-center justify-center">
            {refreshing || isRefreshTriggered ? (
              <Box className="flex items-center justify-center">
                <Spinner size="small" className="text-blue-500" />
              </Box>
            ) : (
              <Box className="flex items-center space-x-2">
                <Box
                  className="transition-transform duration-200 ease-out"
                  style={{
                    transform: shouldTriggerRefresh
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-blue-500"
                  >
                    <path
                      d="M12 4V2L8 6L12 10V8C15.31 8 18 10.69 18 14C18 17.31 15.31 20 12 20C8.69 20 6 17.31 6 14H4C4 18.42 7.58 22 12 22C16.42 22 20 18.42 20 14C20 9.58 16.42 6 12 6Z"
                      fill="currentColor"
                    />
                  </svg>
                </Box>
                <Box className="text-xs text-gray-600 font-medium">
                  {shouldTriggerRefresh ? "Thả để làm mới" : "Kéo để làm mới"}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Content Container */}
      <Box
        ref={containerRef}
        className="w-full h-full overflow-auto"
        style={{
          transform: `translateY(${
            shouldShowTransform ? indicatorHeight : 0
          }px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
          WebkitOverflowScrolling: "touch",
          height: "100%",
          touchAction: "pan-y", // Allow only vertical panning
          paddingBottom: "80px", // Space for bottom navigation
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onScroll={handleScroll}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PullToRefresh;
