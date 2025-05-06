import { useEffect, useState } from 'react'
import { getAllRooms } from '../../utilities/room-api'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function RoomIndexPage() {
    const [rooms, setRooms] = useState([])
    const [error, setError] = useState(null)
    const { accessToken } = useAuth()

    useEffect(() => {
        async function fetchRooms() {
            try {
                console.log("🔒 Fetching rooms with token:", accessToken)
                const data = await getAllRooms(accessToken)
                setRooms(data)
            } catch (err) {
                console.error("❌ Failed to fetch rooms:", err)
                setError('Failed to load rooms.')
            }
        }

        if (accessToken) {
            fetchRooms()
        }
    }, [accessToken])

    return (
        <div className="min-h-screen bg-emerald-50 py-10 px-6 md:px-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-emerald-700">All Rooms</h1>
                <Link
                    to="/rooms/new"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                    + Add Room
                </Link>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {rooms.length === 0 && !error ? (
                <p className="text-gray-500">No rooms found.</p>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-emerald-100 text-emerald-800">
                            <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Hospital</th> 
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rooms.map((room) => (
                                <tr key={room.id} className="border-t">
                                    <td className="px-4 py-2">{room.room_number}</td>
                                    <td className="px-4 py-2">{room.hospital_name}</td> 
                                    <td className="px-4 py-2 text-center">
                                        <Link
                                            to={`/rooms/${room.id}`}
                                            className="text-emerald-600 hover:underline"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
