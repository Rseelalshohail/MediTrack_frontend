import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function EngineerDashboard() {
    const [data, setData] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()


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
                    <h1 className="text-3xl font-bold">Engineer Dashboard</h1>
                    <p className="text-emerald-100">Welcome back!  {user?.username || 'Engineer'} 👋</p>
                    </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                {/* Stats Cards */}
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Work Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-emerald-500">
                        <h2 className="text-lg font-semibold text-gray-700">Assigned Devices</h2>
                        <p className="text-3xl font-bold text-emerald-700 mt-2">{data.total_assigned_devices}</p>
                        <p className="text-sm text-gray-500 mt-1">Under your responsibility</p>
                        <Link to="/devices" className="text-emerald-600 text-sm font-medium hover:text-emerald-800 mt-4 inline-block">
                            View devices →
                        </Link>
                    </div>

                    {/* <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-emerald-500">
                        <h2 className="text-lg font-semibold text-gray-700">My Work Orders</h2>
                        <p className="text-3xl font-bold text-emerald-700 mt-2">{data.pending_spare_requests}</p>
                        <p className="text-sm text-gray-500 mt-1">Assigned to you</p>
                        <Link to="/workorders" className="text-emerald-600 text-sm font-medium hover:text-emerald-800 mt-4 inline-block">
                            Manage work orders →
                        </Link>
                    </div> */}

                    <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-emerald-500">
                        <h2 className="text-lg font-semibold text-gray-700">Open Work Orders</h2>
                        <p className="text-3xl font-bold text-emerald-700 mt-2">{data.total_open_work_orders}</p>
                        <p className="text-sm text-gray-500 mt-1">Still in progress</p>
                        <Link to="/workorders/open" className="text-emerald-600 text-sm font-medium hover:text-emerald-800 mt-4 inline-block">
                            View open orders →
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-emerald-500">
                        <h2 className="text-lg font-semibold text-gray-700">Spare Part Requests</h2>
                        <p className="text-sm text-gray-500 mt-1">Submit new requests for spare parts as needed.</p>
                        <div className="mt-4 space-x-4">
                            <Link to="/spareparts" className="text-emerald-600 font-medium hover:underline">
                                View All Requests →
                            </Link>
                            <Link to="/spareparts/new" className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
                                + Request Spare Part
                            </Link>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-emerald-500">
                        <h2 className="text-lg font-semibold text-gray-700">Work Order Management</h2>
                        <p className="text-sm text-gray-500 mt-1">Create and manage device work orders.</p>
                        <div className="mt-4 space-x-4">
                            <Link to="/workorders" className="text-emerald-600 font-medium hover:underline">
                                View All Work Orders →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center">
                    <svg className="h-5 w-5 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recent Activity
                </h2>
                <div className="bg-white rounded-xl p-6 shadow-md">
                    {Array.isArray(data.recent_activity) && data.recent_activity.length > 0 ? (
                        <ul className="space-y-4">
                            {data.recent_activity.map((item, idx) => (
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