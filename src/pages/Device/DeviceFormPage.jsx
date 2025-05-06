import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    createDevice,
    updateDevice,
    getDeviceById,
    getAllRooms,
    getAllEngineers,
    getAllNurses,
} from '../../utilities/device-api'
import { useAuth } from '../../contexts/AuthContext'

export default function DeviceFormPage() {
    const [formData, setFormData] = useState({
        asset_number: '',
        serial_number: '',
        equipment_name: '',
        model: '',
        manufacturer: '',
        status: 'active',
        room: '',
        assigned_engineer: '',
        assigned_nurses: [],
        last_inventory_date: '',
    })

    const [rooms, setRooms] = useState([])
    const [engineers, setEngineers] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()
    const { accessToken } = useAuth()
    const [nurses, setNurses] = useState([])

    useEffect(() => {
        async function fetchDropdownData() {
            try {
                const [roomData, engineerData, nurseData] = await Promise.all([
                    getAllRooms(accessToken),
                    getAllEngineers(accessToken),
                    getAllNurses(accessToken),
                ])
                setRooms(roomData)
                setEngineers(engineerData)
                setNurses(nurseData)
            } catch (err) {
                console.error("❌ Failed to load dropdown data", err)
                setError("Failed to load form options")
            }
        }

        fetchDropdownData()
    }, [accessToken])

    useEffect(() => {
        if (id) {
            async function fetchDevice() {
                try {
                    const device = await getDeviceById(id, accessToken)
                    setFormData({
                        asset_number: device.asset_number,
                        serial_number: device.serial_number,
                        equipment_name: device.equipment_name,
                        model: device.model,
                        manufacturer: device.manufacturer,
                        status: device.status,
                        room: device.room || '',
                        assigned_engineer: device.assigned_engineer || '',
                        assigned_nurses: device.assigned_nurses || [],
                        last_inventory_date: device.last_inventory_date || '',
                    })
                } catch (err) {
                    setError('Failed to load device data.')
                }
            }
            fetchDevice()
        }
    }, [id, accessToken])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (id) {
                await updateDevice(id, formData, accessToken)
            } else {
                await createDevice(formData, accessToken)
            }
            navigate('/devices')
        } catch (err) {
            console.error(err)
            setError('Submission failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-emerald-50 py-10 px-6 md:px-10">
            <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-8 border-t-4 border-emerald-500">
                <h2 className="text-2xl font-bold text-emerald-700 mb-4">
                    {id ? 'Edit Device' : 'Add New Device'}
                </h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {[
                        ['Asset Number', 'asset_number'],
                        ['Serial Number', 'serial_number'],
                        ['Equipment Name', 'equipment_name'],
                        ['Model', 'model'],
                        ['Manufacturer', 'manufacturer'],
                        ['Last Inventory Date', 'last_inventory_date'],
                    ].map(([label, name]) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input
                                type={name === 'last_inventory_date' ? 'date' : 'text'}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                required={name !== 'last_inventory_date'}
                                className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            {['active', 'inactive', 'maintenance', 'decommissioned'].map((status) => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                        <select
                            name="room"
                            value={formData.room}
                            onChange={handleChange}
                            required
                            className="w-full border border-emerald-300 rounded-lg px-4 py-2"
                        >
                            <option value="">Select a room</option>
                            {rooms.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.room_number} - {r.hospital_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Engineer</label>
                        <select
                            name="assigned_engineer"
                            value={formData.assigned_engineer}
                            onChange={handleChange}
                            className="w-full border border-emerald-300 rounded-lg px-4 py-2"
                        >
                            <option value="">None</option>
                            {engineers.map((eng) => (
                                <option key={eng.id} value={eng.id}>
                                    {eng.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Nurses</label>
                        <select
                            name="assigned_nurses"
                            multiple
                            value={formData.assigned_nurses || []}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    assigned_nurses: Array.from(e.target.selectedOptions, (option) => option.value),
                                })
                            }
                            className="w-full border border-emerald-300 rounded-lg px-4 py-2"
                        >
                            {nurses.map((nurse) => (
                                <option key={nurse.id} value={nurse.id}>
                                    {nurse.username}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold"
                    >
                        {loading ? 'Saving...' : id ? 'Update Device' : 'Create Device'}
                    </button>
                </form>
            </div>
        </div>
    )
}
