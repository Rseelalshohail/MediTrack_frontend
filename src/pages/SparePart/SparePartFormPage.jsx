// src/pages/SpareParts/SparePartFormPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllDevices } from '../../utilities/device-api'
import { createSparePart } from '../../utilities/sparepart-api'
import { useAuth } from '../../contexts/AuthContext'

export default function SparePartFormPage() {
    const { accessToken } = useAuth()
    const [devices, setDevices] = useState([])
    const [formData, setFormData] = useState({
        device: '',
        description: '',
        quantity: 1,
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchDevices() {
            try {
                const data = await getAllDevices(accessToken)
                setDevices(data)
            } catch (err) {
                console.error('❌ Failed to fetch devices:', err)
                setError('Could not load devices.')
            }
        }

        if (accessToken) fetchDevices()
    }, [accessToken])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await createSparePart(formData, accessToken)
            navigate('/spareparts')
        } catch (err) {
            console.error('❌ Failed to submit request:', err)
            setError('Failed to submit spare part request.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-emerald-50 py-10 px-6 md:px-10">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow border-t-4 border-emerald-500">
                <h2 className="text-2xl font-bold text-emerald-700 mb-4">New Spare Part Request</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Device</label>
                        <select
                            name="device"
                            value={formData.device}
                            onChange={handleChange}
                            required
                            className="w-full border border-emerald-300 rounded px-4 py-2"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                            className="w-full border border-emerald-300 rounded px-4 py-2 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            min={1}
                            required
                            className="w-full border border-emerald-300 rounded px-4 py-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold"
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    )
}
