import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function DashboardRedirect() {
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        if (user.user_type === 'admin') navigate('/dashboard/admin')
        else if (user.user_type === 'engineer') navigate('/dashboard/engineer')
        else if (user.user_type === 'nurse') navigate('/dashboard/nurse')
        else navigate('/login')
    }, [user, navigate])

    return null
}
