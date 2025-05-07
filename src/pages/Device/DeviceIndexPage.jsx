import { useEffect, useState } from 'react'
import { getAllDevices, getAssignedDevices } from '../../utilities/device-api'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function DeviceIndexPage() {
    const [devices, setDevices] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user, accessToken } = useAuth()

    useEffect(() => {
        async function fetchDevices() {
            try {
                console.log('🔒 Fetching devices with token:', accessToken)
                setIsLoading(true)

                let data
                if (user?.user_type === 'admin' || user?.user_type === 'nurse') {
                    data = await getAllDevices(accessToken)
                } else if (user?.user_type === 'engineer') {
                    data = await getAssignedDevices(accessToken)
                } else {
                    data = []
                }

                console.log('📦 Devices fetched:', data)
                setDevices(data)
            } catch (err) {
                console.error('❌ Failed to fetch devices:', err)
                setError('Failed to load devices.')
            } finally {
                setIsLoading(false)
            }
        }

        if (accessToken && user) {
            fetchDevices()
        }
    }, [accessToken, user])

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800'
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800'
            case 'out of order':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-6 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-t-4 border-emerald-500">
                    {/* Header */}
                    <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
                            </svg>
                            Medical Devices
                        </h1>
                        {user?.user_type === 'admin' && (
                            <Link
                                to="/devices/new"
                                className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition font-medium shadow-md flex items-center space-x-2"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                </svg>
                                <span>Add Device</span>
                            </Link>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
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

                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                            </div>
                        ) : devices.length === 0 && !error ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                <p className="text-gray-500 text-lg">No devices found.</p>
                                {user?.user_type === 'admin' && (
                                    <Link
                                        to="/devices/new"
                                        className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-800"
                                    >
                                        <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                        </svg>
                                        Add your first device
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                                <table className="min-w-full text-sm divide-y divide-gray-200">
                                    <thead className="bg-emerald-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Asset #</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Equipment Name</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Model</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Status</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Room</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Engineer</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Nurses</th>
                                            {user?.user_type === 'admin' && (
                                                <th className="px-4 py-3 text-center font-medium text-emerald-700">Actions</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {devices.map((device) => (
                                            <tr key={device.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 font-medium text-gray-700">{device.asset_number}</td>
                                                <td className="px-4 py-3 text-gray-700">{device.equipment_name}</td>
                                                <td className="px-4 py-3 text-gray-600">{device.model}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(device.status)}`}>
                                                        {device.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{device.room_display || '-'}</td>
                                                <td className="px-4 py-3 text-gray-600">{device.assigned_engineer_display || '-'}</td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {device.assigned_nurses_display?.length > 0
                                                        ? device.assigned_nurses_display.join(', ') : '-'}
                                                </td>
                                                {user?.user_type === 'admin' && (
                                                    <td className="px-4 py-3 text-center">
                                                        <Link
                                                            to={`/devices/${device.id}`}
                                                            className="text-emerald-600 hover:text-emerald-800 hover:underline inline-flex items-center"
                                                        >
                                                            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                                                            </svg>
                                                            Edit
                                                        </Link>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}