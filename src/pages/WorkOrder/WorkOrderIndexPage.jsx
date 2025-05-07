import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import { getAllWorkOrders } from '../../utilities/workorder-api'

export default function WorkOrderIndexPage() {
    const { accessToken, user } = useAuth()
    const [workOrders, setWorkOrders] = useState([])
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchWorkOrders() {
            try {
                setIsLoading(true)
                const data = await getAllWorkOrders(accessToken, user?.user_type)
                setWorkOrders(data)
            } catch (err) {
                console.error('❌ Failed to load work orders:', err)
                setError('Could not load work orders.')
            } finally {
                setIsLoading(false)
            }
        }

        if (accessToken && user) {
            fetchWorkOrders()
        }
    }, [accessToken, user])

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-6 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-t-4 border-emerald-500">
                    {/* Header */}
                    <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Work Orders
                        </h1>
                        {user?.user_type === 'nurse' && (
                            <Link
                                to="/workorders/new"
                                className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition font-medium shadow-md flex items-center space-x-2"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Create Work Order</span>
                            </Link>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                        ) : workOrders.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                                </svg>
                                <p className="text-gray-500 text-lg">No work orders found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                                <table className="min-w-full text-sm divide-y divide-gray-200">
                                    <thead className="bg-emerald-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Work #</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Device</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Type</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Status</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Reported</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Engineer</th>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Created By</th>
                                            <th className="px-4 py-3 text-center font-medium text-emerald-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {workOrders.map((wo) => (
                                            <tr key={wo.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 font-medium text-gray-700">{wo.work_number}</td>
                                                <td className="px-4 py-3 text-gray-600">{wo.device_display}</td>
                                                <td className="px-4 py-3 capitalize text-gray-600">{wo.work_type}</td>
                                                <td className="px-4 py-3 capitalize text-gray-600">{wo.status}</td>
                                                <td className="px-4 py-3 text-gray-600">{wo.reported_date}</td>
                                                <td className="px-4 py-3 text-gray-600">{wo.assigned_to_display || '-'}</td>
                                                <td className="px-4 py-3 text-gray-600">{wo.created_by_display || '-'}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        to={`/workorders/${wo.id}`}
                                                        className="text-emerald-600 hover:text-emerald-800 hover:underline inline-flex items-center"
                                                    >
                                                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
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
            </div>
        </div>
    )
}
