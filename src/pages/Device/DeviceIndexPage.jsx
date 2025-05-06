import { useEffect, useState } from 'react'
import { getAllDevices, getAssignedDevices } from '../../utilities/device-api'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function DeviceIndexPage() {
    const [devices, setDevices] = useState([])
    const [error, setError] = useState(null)
    const { user, accessToken } = useAuth()

    useEffect(() => {
        async function fetchDevices() {
            try {
                console.log('🔒 Fetching devices with token:', accessToken)
        
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
            }
        }
        

        if (accessToken && user) {
            fetchDevices()
        }
    }, [accessToken, user])

    return (
        <div className="min-h-screen bg-emerald-50 py-10 px-6 md:px-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-emerald-700">All Devices</h1>
                {user?.user_type === 'admin' && (
                    <Link
                        to="/devices/new"
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                    >
                        + Add Device
                    </Link>
                )}
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {devices.length === 0 && !error ? (
                <p className="text-gray-500">No devices found.</p>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-emerald-100 text-emerald-800">
                            <tr>
                                <th className="px-4 py-2 text-left">Asset #</th>
                                <th className="px-4 py-2 text-left">Equipment Name</th>
                                <th className="px-4 py-2 text-left">Model</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Room</th>
                                <th className="px-4 py-2 text-left">Engineer</th>
                                <th className="px-4 py-2 text-left">Nurses</th> 
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((device) => (
                                <tr key={device.id} className="border-t">
                                    <td className="px-4 py-2">{device.asset_number}</td>
                                    <td className="px-4 py-2">{device.equipment_name}</td>
                                    <td className="px-4 py-2">{device.model}</td>
                                    <td className="px-4 py-2">{device.status}</td>
                                    <td className="px-4 py-2">{device.room_display || '-'}</td>
                                    <td className="px-4 py-2">{device.assigned_engineer_display || '-'}</td>
                                    <td className="px-4 py-2">
                                        {device.assigned_nurses_display?.length > 0
                                            ? device.assigned_nurses_display.join(', ') : '-'}</td>
                                    <td className="px-4 py-2 text-center">
                                        {user?.user_type === 'admin' && (
                                            <Link
                                                to={`/devices/${device.id}`}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
