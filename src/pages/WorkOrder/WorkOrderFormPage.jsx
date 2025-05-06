// src/pages/WorkOrder/WorkOrderFormPage.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createWorkOrder } from '../../utilities/workorder-api'
import { getAllDevices } from '../../utilities/device-api'
import { useAuth } from '../../contexts/AuthContext'

export default function WorkOrderFormPage() {
    const [formData, setFormData] = useState({
        device: '',
        description: '',
        work_type: 'cm',
    })
    const [devices, setDevices] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { accessToken } = useAuth()

    useEffect(() => {
        async function fetchDevices() {
            try {
                const data = await getAllDevices(accessToken)
                // Filter devices that have assigned engineers
                const assignedDevices = data.filter(device => device.assigned_engineer_display)
                setDevices(assignedDevices)
            } catch (err) {
                console.error('Failed to load devices:', err)
                setError('Failed to load devices.')
            }
        }

        if (accessToken) fetchDevices()
    }, [accessToken])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createWorkOrder(formData, accessToken)
            navigate('/workorders')
        } catch (err) {
            console.error('Failed to create work order:', err)
            setError('Failed to create work order.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-emerald-50 p-6">
            <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-8 border-t-4 border-emerald-500">
                <h2 className="text-2xl font-bold text-emerald-700 mb-4">Create New Work Order</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                        <select
                            name="device"
                            value={formData.device}
                            onChange={handleChange}
                            required
                            className="w-full border border-emerald-300 rounded-lg px-4 py-2"
                        >
                            <option value="">Select a device</option>
                            {devices.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.asset_number} - {d.model}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                        <select
                            name="work_type"
                            value={formData.work_type}
                            onChange={handleChange}
                            className="w-full border border-emerald-300 rounded-lg px-4 py-2"
                        >
                            <option value="CM">Corrective Maintenance (CM)</option>
                            <option value="PPM">Planned Preventive Maintenance (PPM)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="w-full border border-emerald-300 rounded-lg px-4 py-2 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold"
                    >
                        {loading ? 'Submitting...' : 'Create Work Order'}
                    </button>
                </form>
            </div>
        </div>
    )
}
