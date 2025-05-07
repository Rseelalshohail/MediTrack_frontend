import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
    const { accessToken } = useAuth()
    const [username, setUsername] = useState('')
    const [stats, setStats] = useState({
        devices: 0,
        workOrders: 0,
        spareParts: 0,
        recent_activity: [],
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setUsername(localStorage.getItem('username') || 'Admin')

        async function fetchStats() {
            try {
                const res = await fetch('http://localhost:8000/api/dashboard/admin/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                if (!res.ok) throw new Error('Failed to fetch dashboard stats')
                const data = await res.json()

                setStats({
                    devices: data.total_devices,
                    workOrders: data.total_work_orders,
                    spareParts: data.pending_spare_requests,
                    recent_activity: data.recent_activity || [],
                })
                setLoading(false)
            } catch (err) {
                console.error('❌ Dashboard stats fetch failed:', err)
                setError('Failed to load dashboard data.')
                setLoading(false)
            }
        }

        if (accessToken) fetchStats()
    }, [accessToken])

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
                        <svg className="h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <div className="bg-emerald-600 text-white shadow-md mb-8">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-emerald-100">Welcome back!  {username} 👋</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Stats Grid */}
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Work Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-emerald-500">
                        <h2 className="text-lg font-semibold text-gray-700">Devices</h2>
                        <p className="text-3xl font-bold text-emerald-700 mt-2">{stats.devices}</p>
                        <p className="text-sm text-gray-500 mt-1">Total registered devices</p>
                        <Link to="/devices" className="text-emerald-600 text-sm font-medium hover:text-emerald-800 mt-4 inline-block">
                            Manage devices →
                        </Link>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-emerald-500">
                        <h2 className="text-lg font-semibold text-gray-700">Work Orders</h2>
                        <p className="text-3xl font-bold text-emerald-700 mt-2">{stats.workOrders}</p>
                        <p className="text-sm text-gray-500 mt-1">Total work orders</p>
                        <Link to="/workorders" className="text-emerald-600 text-sm font-medium hover:text-emerald-800 mt-4 inline-block">
                            View work orders →
                        </Link>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-emerald-500">
                        <h2 className="text-lg font-semibold text-gray-700">Spare Requests</h2>
                        <p className="text-3xl font-bold text-emerald-700 mt-2">{stats.spareParts}</p>
                        <p className="text-sm text-gray-500 mt-1">Pending spare part requests</p>
                        <Link to="/spareparts" className="text-emerald-600 text-sm font-medium hover:text-emerald-800 mt-4 inline-block">
                            View spare requests →
                        </Link>
                    </div>
                </div>

                {/* Quick Links */}
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 ">
                    <Link
                        to="/devices"
                        className="bg-white text-emerald-700 flex items-center p-4 rounded-lg shadow transition border-l-4 border-emerald-500"
                    >
                        <svg className="h-6 w-6 mr-3 text-emerald-600 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        Manage Devices
                    </Link>
                    <Link
                        to="/workorders"
                        className="bg-white text-emerald-700 flex items-center p-4 rounded-lg shadow transition border-l-4 border-emerald-500"
                    >
                        <svg className="h-6 w-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        View Work Orders
                    </Link>
                    <Link
                        to="/spareparts"
                        className="bg-white text-emerald-700 flex items-center p-4 rounded-lg shadow transition border-l-4 border-emerald-500"
                    >
                        <svg className="h-6 w-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        View Spare Part Requests
                    </Link>
                    <Link
                        to="/hospitals"
                        className="bg-white text-emerald-700 flex items-center p-4 rounded-lg shadow transition border-l-4 border-emerald-500"
                    >
                        <svg className="h-6 w-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Manage Hospitals
                    </Link>
                    <Link
                        to="/rooms"
                        className="bg-white text-emerald-700 flex items-center p-4 rounded-lg shadow transition border-l-4 border-emerald-500"
                    >
                        <svg className="h-6 w-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Manage Rooms
                    </Link>
                </div>
                {/* Recent Activity */}
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recent Activity
                </h2>

                <div className="bg-white rounded-xl p-6 shadow-md mb-12">
                    {Array.isArray(stats.recent_activity) && stats.recent_activity.length > 0 ? (
                        <ul className="space-y-4">
                            {stats.recent_activity.map((item, idx) => (
                                <li key={idx} className="border-l-4 border-emerald-500 pl-4">
                                    <p className="text-sm text-gray-700">{item.message}</p>
                                    <p className="text-xs text-gray-500">{item.timestamp}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No recent activity yet.</p>
                    )}
                </div>

            </div>
        </div>
    )
}