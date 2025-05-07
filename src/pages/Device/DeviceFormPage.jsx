import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
    createDevice,
    updateDevice,
    deleteDevice,
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

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this device?')) return
        setLoading(true)
        try {
            await deleteDevice(id, accessToken)
            navigate('/devices')
        } catch (err) {
            console.error(err)
            setError('Failed to delete device.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-6 md:px-10">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-t-4 border-emerald-500">
                    {/* Header */}
                    <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            </svg>
                            {id ? 'Edit Device' : 'Add New Device'}
                        </h1>
                        <Link
                            to="/devices"
                            className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition font-medium shadow-md flex items-center space-x-2"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            <span>Back to Devices</span>
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Device Identifiers */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Asset Number</label>
                                        <input
                                            type="text"
                                            name="asset_number"
                                            value={formData.asset_number}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                                        <input
                                            type="text"
                                            name="serial_number"
                                            value={formData.serial_number}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                {/* Device Details */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name</label>
                                        <input
                                            type="text"
                                            name="equipment_name"
                                            value={formData.equipment_name}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                        <input
                                            type="text"
                                            name="model"
                                            value={formData.model}
                                            onChange={handleChange}
                                            required
                                            className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Manufacturer and Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                                    <input
                                        type="text"
                                        name="manufacturer"
                                        value={formData.manufacturer}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        {['active', 'inactive', 'maintenance', 'out of order', 'decommissioned'].map((status) => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                                    <select
                                        name="room"
                                        value={formData.room}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Inventory Date</label>
                                    <input
                                        type="date"
                                        name="last_inventory_date"
                                        value={formData.last_inventory_date}
                                        onChange={handleChange}
                                        className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            {/* Staff Assignments */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Engineer</label>
                                    <select
                                        name="assigned_engineer"
                                        value={formData.assigned_engineer}
                                        onChange={handleChange}
                                        className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assigned Nurses
                                        <span className="text-xs text-gray-500 ml-1">(Hold Ctrl/Cmd to select multiple)</span>
                                    </label>
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
                                        className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 h-32"
                                    >
                                        {nurses.map((nurse) => (
                                            <option key={nurse.id} value={nurse.id}>
                                                {nurse.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {id ? 'Updating...' : 'Creating...'}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                            {id ? 'Update Device' : 'Create Device'}
                                        </>
                                    )}
                                </button>
                                
                                {id && (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold flex items-center justify-center"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Delete Device
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}