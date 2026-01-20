// src/App.jsx
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router';
import { AuthProvider } from './features/auth/AuthContext';
function App() {
  return (
  <AuthProvider>
 <RouterProvider router={router} />;

  </AuthProvider>
  )
}
export default App;
