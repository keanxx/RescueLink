// src/App.jsx
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { AuthProvider } from './features/auth/AuthContext';
import { useEffect } from 'react';
import { socket } from './lib/socket';

function App() {

  // Effect 1: Manage connection lifecycle only
  useEffect(() => {
    socket.connect(); // no-op if already connected

    return () => {
      socket.disconnect(); // properly clean up on unmount
    };
  }, []);

  // Effect 2: Register event listeners separately
  useEffect(() => {
    function onConnect() {
      console.log("✅ Socket connected:", socket.id);
    }

    function onDisconnect(reason) {
      console.log("❌ Socket disconnected:", reason);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);       // named ref — properly removed
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
