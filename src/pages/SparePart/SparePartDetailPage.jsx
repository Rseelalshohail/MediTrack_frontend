// Styled SparePartDetailPage.jsx to match WorkOrderDetailPage

import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg flex items-center space-x-4">
                    <svg className="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span className="text-lg font-medium text-emerald-700">Loading request...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-6 md:px-10">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-t-4 border-red-500 p-6">
                        <h1 className="text-xl font-bold text-red-600 mb-4">Error</h1>
                        <p className="text-gray-700">{error}</p>
                        <Link 
                            to="/spareparts" 
                            className="mt-6 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Return to Spare Parts
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    if (!request) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-t-4 border-emerald-500">
                    {/* Header */}
                    <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">
                            Spare Part Request #{request.request_number}
                        </h1>
                        <Link
                            to="/spareparts"
                            className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition font-medium shadow-md"
                        >
                            Back to Spare Parts
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6 text-gray-700 text-sm">
                        <p><strong>Device:</strong> {request.device_display}</p>
                        <p><strong>Part Name:</strong> {request.part_name}</p>
                        <p><strong>Description:</strong> {request.description}</p>
                        <p><strong>Quantity:</strong> {request.quantity}</p>
                        <p><strong>Status:</strong> {request.status}</p>
                        <p><strong>Requested By:</strong> {request.requested_by_display}</p>
                        <p><strong>Requested Date:</strong> {request.request_date}</p>

                        {user?.user_type === 'admin' && request.status === 'pending' && (
                            <div className="pt-6">
                                <h2 className="font-semibold text-gray-800 mb-2">Update Status</h2>
                                <div className="flex gap-4">
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
                                </div>
                                {statusError && <p className="text-red-500 mt-2">{statusError}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
