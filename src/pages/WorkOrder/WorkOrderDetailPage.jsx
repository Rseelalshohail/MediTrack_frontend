// src/pages/WorkOrder/WorkOrderDetailPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getWorkOrderById, updateWorkOrder } from '../../utilities/workorder-api'
import { useAuth } from '../../contexts/AuthContext'

export default function WorkOrderDetailPage() {
    const { id } = useParams()
    const { accessToken, user } = useAuth()
    const navigate = useNavigate()

    const [workOrder, setWorkOrder] = useState(null)
    const [error, setError] = useState('')
    const [statusUpdateError, setStatusUpdateError] = useState('')
    const [loading, setLoading] = useState(true)
    const [technicalAction, setTechnicalAction] = useState('')

    useEffect(() => {
        async function fetchWorkOrder() {
            try {
                let data = await getWorkOrderById(id, accessToken)
                if (Array.isArray(data)) data = data[0]

                // Debug logs
                console.log('🧪 Work order data:', data)
                console.log('🧪 Frontend user:', user)

                const userId = Number(user?.user_id)
                const assignedTo = Number(data?.assigned_to_id)
                const createdBy = Number(data?.created_by_id)

                // Guard for missing values
                if (!user || !userId || !data) {
                    setError('Data not ready')
                    return
                }

                // Permission logic
                if (user.user_type === 'nurse' && createdBy !== userId) {
                    setError('You do not have permission to view this work order.')
                    setWorkOrder(null)
                } else if (user.user_type === 'engineer' && assignedTo !== userId) {
                    setError('You are not assigned to this work order.')
                    setWorkOrder(null)
                } else {
                    setWorkOrder(data)
                    setError('') // ✅ CLEAR ANY PREVIOUS ERROR
                }
            } catch (err) {
                console.error('❌ Failed to fetch work order:', err)
                setError('Failed to load work order.')
                setWorkOrder(null)
            } finally {
                setLoading(false)
            }
        }

        if (accessToken && user) {
            fetchWorkOrder()
        }
    }, [id, accessToken, user])

    async function handleStatusUpdate(newStatus) {
        try {
            await updateWorkOrder(workOrder.id, {
                status: newStatus,
                technical_action: technicalAction
            }, accessToken)

            navigate('/workorders')
        } catch (err) {
            console.error(err)
            setStatusUpdateError('Failed to update status.')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg flex items-center space-x-4">
                    <svg className="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-lg font-medium text-emerald-700">Loading work order details...</span>
                </div>
            </div>
        )
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-6 md:px-10">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-t-4 border-red-500 p-6">
                        <div className="flex items-center space-x-3 text-red-600 mb-4">
                            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h1 className="text-xl font-bold">Error</h1>
                        </div>
                        <p className="text-gray-700">{error}</p>
                        <Link 
                            to="/workorders" 
                            className="mt-6 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Return to Work Orders
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
    
    if (!workOrder) return null
    console.log('📷 Photo path:', workOrder.photo)

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-t-4 border-emerald-500">
                    {/* Header */}
                    <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Work Order #{workOrder.work_number}
                        </h1>
                        <Link
                            to="/workorders"
                            className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition font-medium shadow-md flex items-center space-x-2"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Work Orders</span>
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Status Badge */}
                        <div className="mb-6 flex justify-end">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                                ${workOrder.status === 'open' ? 'bg-blue-100 text-blue-800' : 
                                 workOrder.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 
                                 'bg-green-100 text-green-800'}`}
                            >
                                {workOrder.status === 'open' && (
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                {workOrder.status === 'in_progress' && (
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                )}
                                {workOrder.status === 'closed' && (
                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {workOrder.status === 'open' ? 'Open' : 
                                 workOrder.status === 'in_progress' ? 'In Progress' : 'Closed'}
                            </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Device</h3>
                                    <p className="mt-1 text-lg font-medium">{workOrder.device_display}</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Work Type</h3>
                                    <p className="mt-1 text-lg font-medium">{workOrder.work_type === 'CM' ? 'Corrective Maintenance' : 'Planned Preventive Maintenance'}</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Reported Date</h3>
                                    <p className="mt-1 text-lg font-medium">{workOrder.reported_date}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Assigned Engineer</h3>
                                    <p className="mt-1 text-lg font-medium">{workOrder.assigned_to_display || 'Not Assigned'}</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Created By</h3>
                                    <p className="mt-1 text-lg font-medium">{workOrder.created_by_display}</p>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Completed Date</h3>
                                    <p className="mt-1 text-lg font-medium">{workOrder.completed_date || 'Not Completed'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8">
                            <h3 className="text-md font-semibold text-gray-700 mb-2">Description</h3>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <p className="whitespace-pre-line">{workOrder.description}</p>
                            </div>
                        </div>

                        {/* Photo */}
                        {workOrder.photo && (
                            <div className="mb-8">
                                <h3 className="text-md font-semibold text-gray-700 mb-2">Attached Image</h3>
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex justify-center">
                                    <img
                                        src={workOrder.photo}
                                        alt="Work Order Photo"
                                        className="rounded-lg shadow-md max-w-full"
                                        style={{ maxHeight: '400px' }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Technical Action Input - For Engineers */}
                        {user.user_type === 'engineer' && workOrder.status !== 'closed' ? (
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Update Status</h3>
                                
                                {statusUpdateError && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                                        <p className="text-sm text-red-600">{statusUpdateError}</p>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Technical Action Taken</label>
                                    <textarea
                                        className="w-full border border-emerald-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        rows={4}
                                        placeholder="Describe the technical action taken..."
                                        value={technicalAction}
                                        onChange={(e) => setTechnicalAction(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={() => handleStatusUpdate('closed')}
                                    className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center justify-center"
                                >
                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Mark as Closed
                                </button>
                            </div>
                        ) : workOrder.status === 'closed' && workOrder.technical_action && (
                            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mt-6">
                                <h3 className="text-lg font-semibold text-gray-700 mb-3">Technical Action Taken</h3>
                                <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <p className="whitespace-pre-line">{workOrder.technical_action}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}