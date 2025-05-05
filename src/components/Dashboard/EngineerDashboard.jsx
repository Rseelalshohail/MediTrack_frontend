import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function EngineerDashboard() {
    const [data, setData] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('access')
                const response = await fetch('http://localhost:8000/api/dashboard/engineer/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })

                if (!response.ok) throw new Error('Failed to fetch dashboard data')

                const json = await response.json()
                setData(json)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-50">
                <div className="text-emerald-600 flex flex-col items-center">
                    <svg className="animate-spin h-12 w-12 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg font-medium">Loading dashboard...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-emerald-50 px-4">
                <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 border-t-4 border-red-500">
                    <div className="flex justify-center mb-4">
                        <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-700 mb-2">Error Loading Dashboard</h2>
                    <p className="text-center text-red-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-medium shadow-md"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-emerald-50 pb-12">
            {/* Header */}
            <div className="bg-emerald-600 text-white shadow-md mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold">Engineer Dashboard</h1>
                            <p className="text-emerald-100">Welcome to MediTrack Engineer Portal</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-center space-x-4">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                <span className="font-medium">Engineer</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-emerald-500 transition-transform hover:transform hover:scale-105">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-700">Assigned Devices</h2>
                            <div className="p-3 bg-emerald-100 rounded-full">
                                <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-emerald-700 mt-4">{data.assigned_devices}</p>
                        <p className="text-sm text-gray-500 mt-1">Medical devices under your care</p>
                        <Link to="/devices" className="text-emerald-600 text-sm font-medium hover:text-emerald-800 mt-4 inline-block">
                            View all devices →
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-emerald-500 transition-transform hover:transform hover:scale-105">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-700">My Work Orders</h2>
                            <div className="p-3 bg-emerald-100 rounded-full">
                                <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-emerald-700 mt-4">{data.my_work_orders}</p>
                        <p className="text-sm text-gray-500 mt-1">Work orders assigned to you</p>
                        <Link to="/workorders" className="text-emerald-600 text-sm font-medium hover:text-emerald-800 mt-4 inline-block">
                            Manage work orders →
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-emerald-500 transition-transform hover:transform hover:scale-105">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-700">Open Work Orders</h2>
                            <div className="p-3 bg-emerald-100 rounded-full">
                                <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-emerald-700 mt-4">{data.open_work_orders}</p>
                        <p className="text-sm text-gray-500 mt-1">Pending maintenance requests</p>
                        <Link to="/workorders/open" className="text-emerald-600 text-sm font-medium hover:text-emerald-800 mt-4 inline-block">
                            View open orders →
                        </Link>
                    </div>
                </div>

                {/* Additional Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                            <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">
                                <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                <span className="text-sm font-medium text-gray-700">New Work Order</span>
                            </button>
                            <button className="flex items-center justify-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">
                                <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Update Status</span>
                            </button>
                            <button className="flex items-center justify-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">
                                <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <span className="text-sm font-medium text-gray-700">Request Parts</span>
                            </button>
                            <button className="flex items-center justify-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition">
                                <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <span className="text-sm font-medium text-gray-700">View Reports</span>
                            </button>
                        </div>
                    </div>
                    
                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                            <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Recent Activity
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3 border-l-2 border-emerald-500 pl-3">
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-700">Work Order WO-202504-0001 status updated to "In Progress"</p>
                                    <p className="text-xs text-gray-500">Today at 9:41 AM</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 border-l-2 border-emerald-500 pl-3">
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-700">Spare part request SPR-202504-0002 has been approved</p>
                                    <p className="text-xs text-gray-500">Yesterday at 3:20 PM</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3 border-l-2 border-emerald-500 pl-3">
                                <div className="flex-grow">
                                    <p className="text-sm font-medium text-gray-700">Device AST-2023-005 assigned to your care</p>
                                    <p className="text-xs text-gray-500">May 2, 2025 at 11:15 AM</p>
                                </div>
                            </div>
                        </div>
                        <a href="#" className="text-emerald-600 text-sm font-medium hover:text-emerald-800 mt-4 inline-block">
                            View all activity →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}