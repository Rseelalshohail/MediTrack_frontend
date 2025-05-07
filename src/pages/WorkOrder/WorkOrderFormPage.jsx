import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createWorkOrder } from '../../utilities/workorder-api'
import { getAllDevices } from '../../utilities/device-api'
import { useAuth } from '../../contexts/AuthContext'

export default function WorkOrderFormPage() {
    const [formData, setFormData] = useState({
        device: '',
        description: '',
        work_type: 'CM',
    })
    const [devices, setDevices] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [photo, setPhoto] = useState(null)
    const navigate = useNavigate()
    const { accessToken } = useAuth()

    useEffect(() => {
        async function fetchDevices() {
            try {
                const data = await getAllDevices(accessToken)
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
        setError('')

        try {
            const form = new FormData()
            form.append('device', formData.device)
            form.append('description', formData.description)
            form.append('work_type', formData.work_type)
            if (photo) form.append('photo', photo)

            const res = await fetch('http://localhost:8000/api/workorders/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: form,
            })

            if (!res.ok) throw new Error('Work order creation failed.')
            navigate('/workorders')
        } catch (err) {
            console.error('Failed to create work order:', err)
            setError('Failed to create work order.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-6 md:px-10">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-t-4 border-emerald-500">
                    {/* Header */}
                    <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6m-3-10a4 4 0 110-8 4 4 0 010 8z" />
                            </svg>
                            Create New Work Order
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

                    {/* Form */}
                    <div className="p-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                                <select
                                    name="device"
                                    value={formData.device}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                    className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                    className="w-full border border-emerald-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPhoto(e.target.files[0])}
                                    className="w-full text-sm mt-1"
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Create Work Order
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
