import React, { useEffect } from "react";
import { Box, Button } from "zmp-ui";

const CustomModal = ({ 
  visible, 
  onClose, 
  children, 
  showCloseButton = true,
  overlayClassName = "",
  modalClassName = "",
  position = "bottom", // "center" hoặc "bottom"
  hideBottomNav = true, // Thêm prop này
  ...props 
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const preventTouchMove = (e) => {
      e.preventDefault();
    };

    if (visible) {
      // Save current scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add CSS classes to prevent scroll
      body.classList.add('modal-no-scroll');
      html.classList.add('modal-no-scroll');
      
      // Add class to hide bottom nav only when needed
      if (hideBottomNav) {
        body.classList.add('modal-hide-nav');
      }
      
      // Set body styles to lock position
      body.style.position = 'fixed';
      body.style.top = `-${scrollTop}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.height = '100%';
      html.style.overflow = 'hidden';
      html.style.height = '100%';
      
      // Add event listeners to prevent scroll
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventTouchMove, { passive: false });
      document.addEventListener('scroll', preventScroll, { passive: false });
      
    } else {
      // Restore scroll position when modal closes
      const scrollTop = parseInt(body.style.top || '0') * -1;
      
      // Remove CSS classes
      body.classList.remove('modal-no-scroll');
      html.classList.remove('modal-no-scroll');
      body.classList.remove('modal-hide-nav');
      
      // Remove event listeners
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventTouchMove);
      document.removeEventListener('scroll', preventScroll);
      
      // Restore body styles
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      body.style.height = '';
      html.style.overflow = '';
      html.style.height = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollTop);
    }

    // Cleanup on unmount
    return () => {
      // Remove CSS classes
      body.classList.remove('modal-no-scroll');
      html.classList.remove('modal-no-scroll');
      body.classList.remove('modal-hide-nav');
      
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventTouchMove);
      document.removeEventListener('scroll', preventScroll);
      
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      body.style.overflow = '';
      body.style.height = '';
      html.style.overflow = '';
      html.style.height = '';
    };
  }, [visible, hideBottomNav]);

  if (!visible) return null;

  const isCenter = position === "center";
  const isBottom = position === "bottom";

  if (isCenter) {
    return (
      <>
        {/* Overlay */}
        <Box
          className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center p-4 ${overlayClassName}`}
          onClick={onClose}
          style={{
            zIndex: 999998,
          }}
        >
          {/* Modal Content */}
          <Box 
            className={`bg-white rounded-lg w-full max-w-sm ${modalClassName}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              zIndex: 999999,
            }}
            {...props}
          >
            {/* Close button (optional) */}
            {showCloseButton && (
              <Box className="absolute top-4 right-4">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={onClose}
                  className="!p-2 !min-w-0 !w-8 !h-8 rounded-full"
                >
                  ✕
                </Button>
              </Box>
            )}
            
            {/* Children content */}
            {children}
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      <Box
        className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 ${overlayClassName}`}
        onClick={onClose}
        style={{
          zIndex: 999998,
        }}
      />
      
      {/* Modal Content */}
      <Box 
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl ${modalClassName}`}
        style={{
          zIndex: 999999,
        }}
        {...props}
      >
        {/* Handle bar - chỉ hiển thị cho bottom sheet */}
        {isBottom && (
          <Box 
            className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2"
          />
        )}
        
        {/* Close button (optional) */}
        {showCloseButton && (
          <Box className="absolute top-4 right-4">
            <Button
              size="small"
              variant="secondary"
              onClick={onClose}
              className="!p-2 !min-w-0 !w-8 !h-8 rounded-full"
            >
              ✕
            </Button>
          </Box>
        )}
        
        {/* Children content */}
        {children}
      </Box>
    </>
  );
};

export default CustomModal;
