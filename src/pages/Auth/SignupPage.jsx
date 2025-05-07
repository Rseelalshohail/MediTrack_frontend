import { useState } from 'react'
import { signupUser } from '../../utilities/auth-api'
import { useNavigate, Link } from 'react-router-dom'
// import logo from '../../assets/images/logo.png'

export default function SignupPage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'admin', // default role
    })

    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
        
        // Calculate password strength
        if (name === 'password') {
            let strength = 0
            if (value.length >= 8) strength += 1
            if (/[A-Z]/.test(value)) strength += 1
            if (/[0-9]/.test(value)) strength += 1
            if (/[^A-Za-z0-9]/.test(value)) strength += 1
            setPasswordStrength(strength)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Password validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        
        if (passwordStrength < 3) {
            setError('Please use a stronger password')
            return
        }
        
        setIsLoading(true)
        setError('')
        
        try {
            await signupUser({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            })
            navigate('/login')
        } catch (err) {
            setError('Signup failed. Please check your input.')
        } finally {
            setIsLoading(false)
        }
    }

    const getStrengthColor = () => {
        if (passwordStrength === 0) return 'bg-gray-200'
        if (passwordStrength === 1) return 'bg-red-400'
        if (passwordStrength === 2) return 'bg-yellow-400'
        if (passwordStrength === 3) return 'bg-blue-400'
        return 'bg-green-400'
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 to-teal-100">
            {/* Left side - illustration/info */}
            <div className="hidden lg:flex lg:w-1/2 bg-emerald-600 flex-col justify-center items-center p-12 text-white">
                <div className="max-w-md">
                    {/* <img src={logo} alt="MediTrack Logo" className="h-20 w-auto mb-8" /> */}
                    <h1 className="text-4xl font-bold mb-6">Welcome to MediTrack</h1>
                    <p className="text-lg mb-8">
                        Your comprehensive solution for healthcare equipment management.
                        Track, maintain, and optimize medical devices with ease.
                    </p>
                    
                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="bg-emerald-500 p-2 rounded-full">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Real-time Tracking</h3>
                                <p className="text-emerald-100">Track equipment status and location in real-time</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <div className="bg-emerald-500 p-2 rounded-full">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Smart Notifications</h3>
                                <p className="text-emerald-100">Stay informed about equipment maintenance</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-4">
                            <div className="bg-emerald-500 p-2 rounded-full">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Enhanced Reporting</h3>
                                <p className="text-emerald-100">Stay informed about equipment maintenance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Right side - form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 space-y-6 border-t-4 border-emerald-500">
                    <div className="text-center mb-2">
                        {/* <div className="flex justify-center">
                            <img src={logo} alt="MediTrack Logo" className="h-16 w-auto lg:hidden" />
                        </div> */}
                        <h2 className="text-2xl font-bold text-emerald-700 mt-4">Create Your Account</h2>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    className="w-full pl-10 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full pl-10 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Your email (optional)"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    className="w-full pl-10 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Create a strong password"
                                />
                            </div>
                            
                            {/* Password strength indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${getStrengthColor()} transition-all duration-300`} 
                                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {passwordStrength === 0 && "Use 8+ characters with letters, numbers & symbols"}
                                        {passwordStrength === 1 && "Password is weak"}
                                        {passwordStrength === 2 && "Password is fair"}
                                        {passwordStrength === 3 && "Password is good"}
                                        {passwordStrength === 4 && "Password is strong"}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full pl-10 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="Confirm your password"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Role</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <select
                                    name="role"
                                    className="w-full pl-10 px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white appearance-none"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="admin">Admin</option>
                                    <option value="engineer">Engineer</option>
                                    <option value="nurse">Nurse</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition font-medium shadow-md flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-pulse">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div className="text-center text-sm text-gray-500 pt-2">
                        Already have an account?{" "}
                        <Link to="/login" className="text-emerald-600 hover:text-emerald-800 font-medium">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}