import { Routes, Route } from 'react-router-dom';
import SignupPage from '../Auth/SignupPage';
import LoginPage from '../Auth/LoginPage'
import ProtectedRoute from '../../components/Shared/ProtectedRoute'
import AdminDashboard from '../../components/Dashboard/AdminDashboard'
import EngineerDashboard from '../../components/Dashboard/EngineerDashboard'
import NurseDashboard from '../../components/Dashboard/NurseDashboard'
import HospitalIndexPage from '../Hospital/HospitalIndexPage'
import HospitalFormPage from '../Hospital/HospitalFormPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="text-3xl font-bold text-blue-600 text-center p-8">
          Welcome to MediTrack!
        </div>
      } />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute> } />
      <Route path="/engineer" element={
        <ProtectedRoute allowedRoles={['engineer']}>
          <EngineerDashboard />
        </ProtectedRoute> } />
      <Route path="/nurse" element={
        <ProtectedRoute allowedRoles={['nurse']}>
          <NurseDashboard />
        </ProtectedRoute> } />
        <Route path="/hospitals" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <HospitalIndexPage />
        </ProtectedRoute> } />
      <Route path="/hospitals/new" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <HospitalFormPage />
        </ProtectedRoute> } />

    </Routes>
    
  );
}

export default App;