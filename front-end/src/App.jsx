// src/App.jsx
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { AuthProvider } from './features/auth/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { socket } from './lib/socket';
import AlertFlashOverlay from './components/AlertFlashOverlay';

function App() {
  const [flashAlert, setFlashAlert] = useState(null);

  useEffect(() => {
    socket.connect();
    return () => { socket.disconnect(); };
  }, []);

  useEffect(() => {
    function onConnect() {
      console.log("✅ Socket connected:", socket.id);
    }

    function onNewAlert(newAlert) {
      // Trigger the fullscreen overlay on ANY page
      setFlashAlert(newAlert);
    }

    socket.on('connect', onConnect);
    socket.on('alert:new', onNewAlert);  // ← listens globally

    return () => {
      socket.off('connect', onConnect);
      socket.off('alert:new', onNewAlert);
    };
  }, []);

  // useCallback so the ref doesn't change on every render
  const handleDismiss = useCallback(() => setFlashAlert(null), []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />

      {/* Overlay sits here — outside the router, renders above everything */}
      <AlertFlashOverlay
        alert={flashAlert}
        onDismiss={handleDismiss}
      />
    </AuthProvider>
  );
}

export default App;
