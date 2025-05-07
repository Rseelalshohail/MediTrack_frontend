import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { createRoom, getRoomById, updateRoom, deleteRoom } from '../../utilities/room-api'
import { getAllHospitals } from '../../utilities/hospital-api'
import { useAuth } from '../../contexts/AuthContext'

export default function RoomFormPage() {
    const [formData, setFormData] = useState({ room_number: '', hospital: '' })
    const [hospitals, setHospitals] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams()
    const { accessToken } = useAuth()

    useEffect(() => {
        if (id) {
            async function fetchRoom() {
                try {
                    const room = await getRoomById(id, accessToken)
                    setFormData({ room_number: room.room_number, hospital: room.hospital })
                } catch (err) {
                    setError('Failed to load room data.')
                }
            }
            fetchRoom()
        }
    }, [id, accessToken])

    useEffect(() => {
        async function fetchHospitals() {
            try {
                const data = await getAllHospitals(accessToken)
                setHospitals(data)
            } catch (err) {
                setError('Failed to load hospitals.')
            }
        }

        if (accessToken) {
            fetchHospitals()
        }
    }, [accessToken])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (id) {
                await updateRoom(id, formData, accessToken)
            } else {
                await createRoom(formData, accessToken)
            }
            navigate('/rooms')
        } catch (err) {
            setError('Submission failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this room?')) return
        setLoading(true)
        try {
            await deleteRoom(id, accessToken)
            navigate('/rooms')
        } catch (err) {
            console.error(err)
            setError('Failed to delete room.')
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            {id ? 'Edit Room' : 'Add New Room'}
                        </h1>
                        <Link
                            to="/rooms"
                            className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition font-medium shadow-md flex items-center space-x-2"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to Rooms</span>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                                <input
                                    type="text"
                                    name="room_number"
                                    value={formData.room_number}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
                                <select
                                    name="hospital"
                                    value={formData.hospital}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="">Select a hospital</option>
                                    {hospitals.map(h => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
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
                                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {id ? 'Update Room' : 'Create Room'}
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
                                                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete Room
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
