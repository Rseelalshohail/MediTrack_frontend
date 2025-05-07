import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getAllWorkOrders } from '../../utilities/workorder-api'
import { Link } from 'react-router-dom'

export default function NurseClosedWorkOrdersPage() {
    const { accessToken, user } = useAuth()
    const [orders, setOrders] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const all = await getAllWorkOrders(accessToken, 'nurse')
                const filtered = all.filter(order =>
                    order.created_by_display === user.username && order.status === 'closed'
                )
                setOrders(filtered)
            } catch (err) {
                setError('Failed to load closed work orders.')
            } finally {
                setLoading(false)
            }
        }

        if (accessToken && user) fetchData()
    }, [accessToken, user])

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-6 md:px-10">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-t-4 border-emerald-500">
                    <div className="bg-emerald-600 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6m-3-10a4 4 0 110-8 4 4 0 010 8z" />
                            </svg>
                            Closed Work Orders
                        </h1>
                    </div>

                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                                </svg>
                                <p className="text-gray-500 text-lg">No closed work orders found.</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {orders.map(order => (
                                    <li
                                        key={order.id}
                                        className="px-4 py-4 hover:bg-gray-50 transition flex justify-between items-start"
                                    >
                                        <div>
                                            <p className="text-lg font-semibold text-gray-800">
                                                #{order.work_number} — {order.device_display}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Completed: {order.completed_date || '-'}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/workorders/${order.id}`}
                                            className="text-emerald-600 font-medium hover:text-emerald-800 hover:underline"
                                        >
                                            View
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
