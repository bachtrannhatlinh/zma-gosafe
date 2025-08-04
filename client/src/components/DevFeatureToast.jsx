import { useState, useRef } from 'react';

const toastStyle = {
  position: 'fixed',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'linear-gradient(135deg, #fb923c 0%, #ef4444 100%)',
  color: '#fff',
  padding: '20px 32px 20px 32px',
  borderRadius: '20px',
  fontSize: '18px',
  fontWeight: 600,
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25)',
  zIndex: 99999,
  minWidth: '260px',
  maxWidth: '90vw',
  textAlign: 'center',
  pointerEvents: 'auto',
  opacity: 1,
  transition: 'opacity 0.4s cubic-bezier(.4,0,.2,1)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const DevFeatureToast = ({
  children,
  message = 'Tính năng đang phát triển. Vui lòng quay lại sau!',
  toastType = 'info',
  ...rest
}) => {
  const [show, setShow] = useState(false);
  const timerRef = useRef();

  const showCustomToast = () => {
    setShow(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShow(false), 2000);
  };

  const handleClick = (e) => {
    if (window.zmp && window.zmp.showToast) {
      window.zmp.showToast({
        message,
        type: toastType,
        duration: 2000,
      });
    } else if (window.showToast) {
      window.showToast({
        message,
        type: toastType,
        duration: 2000,
      });
    } else {
      showCustomToast();
    }
    if (rest.onClick) rest.onClick(e);
  };

  if (typeof children === 'function') {
    return <>
      {children(handleClick)}
      {show && (
        <div style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            ...toastStyle,
            pointerEvents: 'auto',
            position: 'static',
            left: undefined,
            top: undefined,
            transform: undefined,
          }}>
            <span style={{fontSize: 32, marginBottom: 8, display: 'block'}}>🚧</span>
            <span>{message}</span>
          </div>
        </div>
      )}
    </>;
  }

  if (children) {
    return <>
      {children}
      {show && (
        <div style={toastStyle}>{message}</div>
      )}
    </>;
  }

  return (
    <>
      <button type="button" onClick={handleClick} {...rest}>
        Tính năng đang phát triển
      </button>
      {show && (
        <div style={toastStyle}>{message}</div>
      )}
    </>
  );
};

export default DevFeatureToast;
