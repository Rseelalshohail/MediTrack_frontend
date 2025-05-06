// src/pages/SpareParts/SparePartIndexPage.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getAllSpareParts } from '../../utilities/sparepart-api'
import { Link } from 'react-router-dom'

export default function SparePartIndexPage() {
    const { accessToken, user } = useAuth()
    const [spareParts, setSpareParts] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchSpareParts() {
            try {
                const data = await getAllSpareParts(accessToken)
                setSpareParts(data)
            } catch (err) {
                console.error('❌ Failed to fetch spare parts:', err)
                setError('Could not load spare parts.')
            }
        }

        if (accessToken) fetchSpareParts()
    }, [accessToken])

    return (
        <div className="min-h-screen bg-emerald-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-emerald-700">Spare Part Requests</h1>
                    {user?.user_type === 'engineer' && (
                        <Link
                            to="/spareparts/new"
                            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
                        >
                            + New Request
                        </Link>
                    )}
                </div>

                {error && <p className="text-red-500">{error}</p>}

                {spareParts.length === 0 ? (
                    <p className="text-gray-500">No spare part requests found.</p>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-emerald-100 text-emerald-800">
                                <tr>
                                    <th className="px-4 py-2 text-left">Request #</th>
                                    <th className="px-4 py-2 text-left">Device</th>
                                    <th className="px-4 py-2 text-left">Description</th>
                                    <th className="px-4 py-2 text-left">Quantity</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Requested By</th>
                                    <th className="px-4 py-2 text-left">Date</th>
                                    <th className="px-4 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spareParts.map((sp) => (
                                    <tr key={sp.id} className="border-t">
                                        <td className="px-4 py-2">{sp.request_number}</td>
                                        <td className="px-4 py-2">{sp.device_display}</td>
                                        <td className="px-4 py-2">{sp.description}</td>
                                        <td className="px-4 py-2">{sp.quantity}</td>
                                        <td className="px-4 py-2 capitalize">{sp.status}</td>
                                        <td className="px-4 py-2">{sp.requested_by_display}</td>
                                        <td className="px-4 py-2">{sp.request_date}</td>
                                        <td className="px-4 py-2 text-center">
                                            <Link
                                                to={`/spareparts/${sp.id}`}
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
