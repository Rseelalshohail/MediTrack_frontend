import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { getAllWorkOrders } from '../../utilities/workorder-api'

export default function WorkOrderIndexPage() {
    const { accessToken, user } = useAuth()
    const [workOrders, setWorkOrders] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchWorkOrders() {
            try {
                const data = await getAllWorkOrders(accessToken, user?.user_type)
                setWorkOrders(data)
            } catch (err) {
                console.error('❌ Failed to load work orders:', err)
                setError('Could not load work orders.')
            }
        }

        if (accessToken && user) {
            fetchWorkOrders()
        }
    }, [accessToken, user])

    return (
        <div className="min-h-screen bg-emerald-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-emerald-700">Work Orders</h1>
                    {user?.user_type === 'nurse' && (
                        <Link
                            to="/workorders/new"
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                        >
                            + Create Work Order
                        </Link>
                    )}
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {workOrders.length === 0 ? (
                    <p className="text-gray-500">No work orders found.</p>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-emerald-100 text-emerald-800">
                                <tr>
                                    <th className="px-4 py-2 text-left">Work #</th>
                                    <th className="px-4 py-2 text-left">Device</th>
                                    <th className="px-4 py-2 text-left">Type</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Reported</th>
                                    <th className="px-4 py-2 text-left">Engineer</th>
                                    <th className="px-4 py-2 text-left">Created By</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workOrders.map((wo) => (
                                    <tr key={wo.id} className="border-t">
                                        <td className="px-4 py-2">{wo.work_number}</td>
                                        <td className="px-4 py-2">{wo.device_display}</td>
                                        <td className="px-4 py-2 capitalize">{wo.work_type}</td>
                                        <td className="px-4 py-2 capitalize">{wo.status}</td>
                                        <td className="px-4 py-2">{wo.reported_date}</td>
                                        <td className="px-4 py-2">{wo.assigned_to_display || '-'}</td>
                                        <td className="px-4 py-2">{wo.created_by_display || '-'}</td>
                                        <td className="px-4 py-2 text-center">
                                            <Link
                                                to={`/workorders/${wo.id}`}
                                                className="text-emerald-600 hover:underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
