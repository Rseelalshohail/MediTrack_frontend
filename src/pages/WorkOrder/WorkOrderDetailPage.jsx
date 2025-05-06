// src/pages/WorkOrder/WorkOrderDetailPage.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
            await updateWorkOrder(workOrder.id, { status: newStatus }, accessToken)
            navigate('/workorders')
        } catch (err) {
            setStatusUpdateError('Failed to update status.')
        }
    }

    if (loading) return <div className="p-6">Loading...</div>
    if (error) return <div className="p-6 text-red-500 font-semibold">{error}</div>
    if (!workOrder) return null

    return (
        <div className="min-h-screen bg-emerald-50 p-6">
            <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-xl border-t-4 border-emerald-500">
                <h1 className="text-2xl font-bold text-emerald-700 mb-4">
                    Work Order #{workOrder.work_number}
                </h1>

                <div className="space-y-3 text-gray-700 text-sm">
                    <p><strong>Device:</strong> {workOrder.device_display}</p>
                    <p><strong>Type:</strong> {workOrder.work_type}</p>
                    <p><strong>Status:</strong> {workOrder.status}</p>
                    <p><strong>Reported Date:</strong> {workOrder.reported_date}</p>
                    <p><strong>Completed Date:</strong> {workOrder.completed_date || '-'}</p>
                    <p><strong>Assigned Engineer:</strong> {workOrder.assigned_to_display || '-'}</p>
                    <p><strong>Created By:</strong> {workOrder.created_by_display}</p>
                    <p><strong>Description:</strong> {workOrder.description}</p>
                </div>

                {user.user_type === 'engineer' && workOrder.status !== 'closed' && (
                    <div className="mt-6">
                        <h2 className="font-semibold text-gray-800 mb-2">Update Status</h2>
                        <button
                            onClick={() => handleStatusUpdate('closed')}
                            className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
                        >
                            Mark as Closed
                        </button>
                        {statusUpdateError && <p className="text-red-500 mt-2">{statusUpdateError}</p>}
                    </div>
                )}
            </div>
        </div>
    )
}
