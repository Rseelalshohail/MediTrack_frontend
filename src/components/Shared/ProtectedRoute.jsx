import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function PrivateRoute({ children, allowedRoles }) {
    const { user, isAuthChecked } = useAuth()

    if (!isAuthChecked) return null // ⏳ Wait until we checked localStorage

    if (!user) return <Navigate to="/login" />

    if (allowedRoles && !allowedRoles.includes(user.user_type)) {
        return <Navigate to="/unauthorized" />
    }

    return children
}
