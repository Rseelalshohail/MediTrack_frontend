import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useState } from 'react'
import logo from '../../assets/images/logo.png'

export default function Navbar() {
    const { userType, logout } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo + App Title */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="flex items-center space-x-2">
                            <img src={logo} alt="MediTrack Logo" className="h-14 w-auto" /> {/* Increased logo size */}
                            <span className="text-2xl font-bold text-emerald-700 hidden sm:block">MediTrack</span>
                        </Link>
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            to="/dashboard" 
                            className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out"
                        >
                            Dashboard
                        </Link>
                        <Link 
                            to="/devices" 
                            className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out"
                        >
                            Devices
                        </Link>
                        <button 
                            onClick={logout} 
                            className="text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-lg font-medium transition duration-150 ease-in-out"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-emerald-600 focus:outline-none"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger icon */}
                            {!mobileMenuOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
                        <Link
                            to="/dashboard"
                            className="text-gray-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/devices"
                            className="text-gray-700 hover:text-emerald-600 block px-3 py-2 rounded-md text-base font-medium"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Devices
                        </Link>
                        <button
                            onClick={() => {
                                setMobileMenuOpen(false)
                                logout()
                            }}
                            className="text-gray-700 hover:text-red-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}