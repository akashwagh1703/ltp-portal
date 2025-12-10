import { Navigate } from 'react-router-dom'
import { isAuthenticated } from './api/hooks/useAuth'
import AdminLayout from './components/layout/AdminLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Turfs from './pages/Turfs'
import AddTurf from './pages/AddTurf'
import Owners from './pages/Owners'
import Bookings from './pages/Bookings'
import Payouts from './pages/Payouts'
import TurfUpdateRequests from './pages/TurfUpdateRequests'
import TurfImages from './pages/TurfImages'
import Reports from './pages/Reports'
import CMS from './pages/CMS'
import Settings from './pages/Settings'
import Logs from './pages/Logs'
import Subscriptions from './pages/Subscriptions'
import SubscriptionSettings from './pages/SubscriptionSettings'
import Players from './pages/Players'
import Coupons from './pages/Coupons'
import Reviews from './pages/Reviews'

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

export const routes = [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'turfs', element: <Turfs /> },
      { path: 'turfs/add', element: <AddTurf /> },
      { path: 'turfs/edit/:id', element: <AddTurf /> },
      { path: 'turfs/:id/images', element: <TurfImages /> },
      { path: 'owners', element: <Owners /> },
      { path: 'players', element: <Players /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'payouts', element: <Payouts /> },
      { path: 'coupons', element: <Coupons /> },
      { path: 'reviews', element: <Reviews /> },
      { path: 'turf-update-requests', element: <TurfUpdateRequests /> },
      { path: 'reports', element: <Reports /> },
      { path: 'cms', element: <CMS /> },
      { path: 'subscriptions', element: <Subscriptions /> },
      { path: 'subscriptions/settings', element: <SubscriptionSettings /> },
      { path: 'settings', element: <Settings /> },
      { path: 'logs', element: <Logs /> }
    ]
  }
]
