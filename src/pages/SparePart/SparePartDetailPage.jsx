// src/pages/SpareParts/SparePartDetailPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSparePartById, updateSparePart } from '../../utilities/sparepart-api'
import { useAuth } from '../../contexts/AuthContext'

export default function SparePartDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, accessToken } = useAuth()

    const [request, setRequest] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [statusError, setStatusError] = useState('')

    useEffect(() => {
        async function fetchRequest() {
            try {
                const data = await getSparePartById(id, accessToken)
                setRequest(data)
            } catch (err) {
                console.error('❌ Failed to load request:', err)
                setError('Failed to load spare part request.')
            } finally {
                setLoading(false)
            }
        }

        if (accessToken) fetchRequest()
    }, [id, accessToken])

    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateSparePart(id, { status: newStatus }, accessToken)
            navigate('/spareparts')
        } catch (err) {
            console.error('❌ Failed to update status:', err)
            setStatusError('Failed to update status.')
        }
    }

    if (loading) return <div className="p-6">Loading...</div>
    if (error) return <div className="p-6 text-red-500">{error}</div>
    if (!request) return null

    return (
        <div className="min-h-screen bg-emerald-50 p-6">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow border-t-4 border-emerald-500">
                <h1 className="text-2xl font-bold text-emerald-700 mb-4">
                    Spare Part Request #{request.request_number}
                </h1>

                <div className="space-y-3 text-gray-700 text-sm">
                    <p><strong>Device:</strong> {request.device_display}</p>
                    <p><strong>Description:</strong> {request.description}</p>
                    <p><strong>Quantity:</strong> {request.quantity}</p>
                    <p><strong>Status:</strong> {request.status}</p>
                    <p><strong>Requested By:</strong> {request.requested_by_display}</p>
                    <p><strong>Requested Date:</strong> {request.request_date}</p>
                </div>

                {/* Admin: Approve / Deny */}
                {user?.user_type === 'admin' && request.status === 'pending' && (
                    <div className="mt-6 space-x-4">
                        <h2 className="font-semibold text-gray-800 mb-2">Update Status</h2>
                        <button
                            onClick={() => handleStatusUpdate('approved')}
                            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => handleStatusUpdate('rejected')}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                            Reject
                        </button>
                        {statusError && <p className="text-red-500 mt-2">{statusError}</p>}
                    </div>
                )}
            </div>
        </div>
    )
}
