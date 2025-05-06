import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createRoom, getRoomById, updateRoom } from '../../utilities/room-api'
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

    return (
        <div className="min-h-screen bg-emerald-50 py-10 px-6 md:px-10">
            <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-8 border-t-4 border-emerald-500">
                <h2 className="text-2xl font-bold text-emerald-700 mb-4">
                    {id ? 'Edit Room' : 'Add New Room'}
                </h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold"
                    >
                        {loading ? 'Saving...' : id ? 'Update Room' : 'Create Room'}
                    </button>
                </form>
            </div>
        </div>
    )
}
