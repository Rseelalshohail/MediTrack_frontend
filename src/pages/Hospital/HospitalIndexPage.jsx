import { useEffect, useState } from 'react'
import { getAllHospitals } from '../../utilities/hospital-api'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function HospitalIndexPage() {
    const [hospitals, setHospitals] = useState([])
    const [error, setError] = useState(null)
    const { accessToken } = useAuth()

    useEffect(() => {
        async function fetchHospitals() {
            try {
                console.log("🔒 Fetching hospitals with token:", accessToken)
                const data = await getAllHospitals(accessToken)
                setHospitals(data)
            } catch (err) {
                console.error("❌ Failed to fetch hospitals:", err)
                setError('Failed to load hospitals.')
            }
        }

        if (accessToken) {
            fetchHospitals()
        }
    }, [accessToken])

    return (
        <div className="min-h-screen bg-emerald-50 py-10 px-6 md:px-10">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-emerald-700">All Hospitals</h1>
                <Link
                    to="/hospitals/new"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                >
                    + Add Hospital
                </Link>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {hospitals.length === 0 && !error ? (
                <p className="text-gray-500">No hospitals found.</p>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-emerald-100 text-emerald-800">
                            <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hospitals.map((hospital) => (
                                <tr key={hospital.id} className="border-t">
                                    <td className="px-4 py-2">{hospital.name}</td>
                                    <td className="px-4 py-2 text-center">
                                        <Link
                                            to={`/hospitals/${hospital.id}`}
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
