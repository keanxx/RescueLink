import { createBrowserRouter } from 'react-router-dom';
import SidebarLayout from '@/layouts/SidebarLayout';
import Dashboard from '@/pages/Dashboard';
import LiveMap from '@/pages/LiveMap';
import Logs from '@/pages/Logs';
import Settings from '@/pages/Settings';
import Users from '@/pages/Users';
import Alerts from '@/pages/Alerts';

export const router = createBrowserRouter([
  {
    element: <SidebarLayout />,
    children: [
      { path: '/', element: <Dashboard /> },
      { path: '/map', element: <LiveMap /> },
      {path: '/users', element: <Users /> },
      {path: '/settings', element: <Settings /> },
      {path: '/logs', element: <Logs /> },
      {path: '/alerts', element: <Alerts /> }
    ],
  },
]);