import { useState } from 'react'
import { loginUser } from '../../utilities/auth-api'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const userData = await loginUser(formData)

            // ✅ Update AuthContext (this is critical!)
            login(userData)

            // ⏳ Small delay to make sure context updates before navigating
            setTimeout(() => {
                if (userData.user_type === 'admin') navigate('/admin')
                else if (userData.user_type === 'engineer') navigate('/engineer')
                else if (userData.user_type === 'nurse') navigate('/nurse')
                else setError('Unknown user type.')
            }, 0)
        } catch (err) {
            setError('Login failed. Check your credentials.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border-t-4 border-emerald-500">
                <div className="flex justify-center mb-2">
                    <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-center text-emerald-700">MediTrack</h2>
                <p className="text-center text-emerald-600 text-sm font-medium mb-4">Access your account</p>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoFocus
                            className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-medium shadow-md flex items-center justify-center space-x-2"
                    >
                        <span>Login</span>
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                        </svg>
                    </button>
                </form>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mt-4">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <div className="text-center text-sm text-gray-500 pt-4">
                    Don’t have an account?{' '}
                    <Link to="/signup" className="text-emerald-600 hover:text-emerald-800 font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}
