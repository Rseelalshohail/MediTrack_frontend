import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminDashboard() {
    const { accessToken } = useAuth()
    const [username, setUsername] = useState('')
    const [stats, setStats] = useState({
        devices: 0,
        workOrders: 0,
        spareParts: 0,
    })
    const [error, setError] = useState('')

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
                })
            } catch (err) {
                console.error('❌ Dashboard stats fetch failed:', err)
                setError('Failed to load dashboard data.')
            }
        }

        if (accessToken) fetchStats()
    }, [accessToken])

    return (
        <div className="min-h-screen bg-emerald-50 p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-emerald-700 mb-2">
                    Welcome, {username} 👋
                </h1>
                <p className="text-emerald-600 mb-6">Here’s an overview of your medical device system.</p>

                {error && <p className="text-red-600 mb-4">{error}</p>}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-emerald-500">
                        <h2 className="text-lg font-semibold text-gray-700">Devices</h2>
                        <p className="text-3xl font-bold text-emerald-700">{stats.devices}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-emerald-500">
                        <h2 className="text-lg font-semibold text-gray-700">Work Orders</h2>
                        <p className="text-3xl font-bold text-emerald-700">{stats.workOrders}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow border-t-4 border-emerald-500">
                        <h2 className="text-lg font-semibold text-gray-700">Spare Requests</h2>
                        <p className="text-3xl font-bold text-emerald-700">{stats.spareParts}</p>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                        href="/devices"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 rounded-lg shadow transition"
                    >
                        Manage Devices
                    </a>
                    <a
                        href="/workorders"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 rounded-lg shadow transition"
                    >
                        View Work Orders
                    </a>
                    <a
                        href="/spareparts"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 rounded-lg shadow transition"
                    >
                        View Spare Part Requests
                    </a>
                    <a
                        href="/hospitals"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 rounded-lg shadow transition"
                    >
                        Manage Hospitals
                    </a>
                    <a
                        href="/rooms"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-center py-3 rounded-lg shadow transition"
                    >
                        Manage Rooms
                    </a>
                </div>
            </div>
        </div>
    )
}
