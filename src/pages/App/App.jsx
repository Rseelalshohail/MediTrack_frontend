// src/pages/App/App.jsx
import { Routes, Route, Outlet, useLocation } from 'react-router-dom'
import SignupPage from '../Auth/SignupPage'
import LoginPage from '../Auth/LoginPage'
import ProtectedRoute from '../../components/Shared/ProtectedRoute'
import AdminDashboard from '../../components/Dashboard/AdminDashboard'
import EngineerDashboard from '../../components/Dashboard/EngineerDashboard'
import NurseDashboard from '../../components/Dashboard/NurseDashboard'
import HospitalIndexPage from '../Hospital/HospitalIndexPage'
import HospitalFormPage from '../Hospital/HospitalFormPage'
import RoomIndexPage from '../Room/RoomIndexPage'
import RoomFormPage from '../Room/RoomFormPage'
import DeviceIndexPage from '../Device/DeviceIndexPage'
import DeviceFormPage from '../Device/DeviceFormPage'
import DashboardRedirect from '../../components/Dashboard/DashboardRedirect'
import Navbar from '../../components/Shared/Navbar'
import Footer from '../../components/Shared/Footer'
import WorkOrderIndexPage from '../WorkOrder/WorkOrderIndexPage'
import WorkOrderFormPage from '../WorkOrder/WorkOrderFormPage'
import WorkOrderDetailPage from '../WorkOrder/WorkOrderDetailPage'
import SparePartIndexPage from '../SparePart/SparePartIndexPage'
import SparePartFormPage from '../SparePart/SparePartFormPage'
import SparePartDetailPage from '../SparePart/SparePartDetailPage'
import EngineerOpenWorkOrdersPage from '../WorkOrder/EngineerOpenWorkOrdersPage'
import NurseOpenWorkOrdersPage from '../WorkOrder/NurseOpenWorkOrdersPage'
import NurseClosedWorkOrdersPage from '../WorkOrder/NurseClosedWorkOrdersPage'

function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  )
}

function App() {
  const location = useLocation()
  const noNavbarRoutes = ['/login', '/signup', '/']

  const isNavbarVisible = !noNavbarRoutes.includes(location.pathname)

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<div className="text-3xl font-bold text-blue-600 text-center p-8">Welcome to MediTrack!</div>} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes with Navbar and Footer */}
      {isNavbarVisible && (
        <Route path="/" element={<LayoutWithNavbar />}>
          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<ProtectedRoute allowedRoles={['admin', 'engineer', 'nurse']}><DashboardRedirect /></ProtectedRoute>}
          />
          <Route
            path="dashboard/admin"
            element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="dashboard/engineer"
            element={<ProtectedRoute allowedRoles={['engineer']}><EngineerDashboard /></ProtectedRoute>}
          />
          <Route
            path="dashboard/nurse"
            element={<ProtectedRoute allowedRoles={['nurse']}><NurseDashboard /></ProtectedRoute>}
          />

          {/* Hospitals */}
          <Route path="hospitals" element={<ProtectedRoute allowedRoles={['admin']}><HospitalIndexPage /></ProtectedRoute>} />
          <Route path="hospitals/new" element={<ProtectedRoute allowedRoles={['admin']}><HospitalFormPage /></ProtectedRoute>} />
          <Route path="hospitals/:id" element={<ProtectedRoute allowedRoles={['admin']}><HospitalFormPage /></ProtectedRoute>} />

          {/* Rooms */}
          <Route path="rooms" element={<ProtectedRoute allowedRoles={['admin']}><RoomIndexPage /></ProtectedRoute>} />
          <Route path="rooms/new" element={<ProtectedRoute allowedRoles={['admin']}><RoomFormPage /></ProtectedRoute>} />
          <Route path="rooms/:id" element={<ProtectedRoute allowedRoles={['admin']}><RoomFormPage /></ProtectedRoute>} />

          {/* Devices */}
          <Route path="devices" element={<ProtectedRoute allowedRoles={['admin', 'engineer', 'nurse']}><DeviceIndexPage /></ProtectedRoute>} />
          <Route path="devices/new" element={<ProtectedRoute allowedRoles={['admin']}><DeviceFormPage /></ProtectedRoute>} />
          <Route path="devices/:id" element={<ProtectedRoute allowedRoles={['admin']}><DeviceFormPage /></ProtectedRoute>} />

          {/* Work Orders */}
          <Route path="workorders" element={<ProtectedRoute allowedRoles={['admin', 'engineer', 'nurse']}><WorkOrderIndexPage /></ProtectedRoute>} />
          <Route path="workorders/new" element={<ProtectedRoute allowedRoles={['nurse']}><WorkOrderFormPage /></ProtectedRoute>} />
          <Route path="workorders/:id" element={<ProtectedRoute allowedRoles={['admin', 'engineer', 'nurse']}><WorkOrderDetailPage /></ProtectedRoute>} />

          {/* Spare Parts */}
          <Route path="spareparts" element={<ProtectedRoute allowedRoles={['admin', 'engineer']}><SparePartIndexPage /></ProtectedRoute>} />
          <Route path="spareparts/new" element={<ProtectedRoute allowedRoles={['engineer']}><SparePartFormPage /></ProtectedRoute>} />
          <Route path="spareparts/:id" element={<ProtectedRoute allowedRoles={['admin', 'engineer']}><SparePartDetailPage /></ProtectedRoute>} />
          
          {/* opened/close W.O */}
          <Route path="/workorders/open" element={<EngineerOpenWorkOrdersPage />} />
          <Route path="/workorders/nurse/open" element={<NurseOpenWorkOrdersPage />} />
          <Route path="/workorders/nurse/closed" element={<NurseClosedWorkOrdersPage />} />
        </Route>
      )}
    </Routes>
  )
}

export default App
