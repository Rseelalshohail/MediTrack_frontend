import { useEffect, useState } from 'react'
import { getAllHospitals } from '../../utilities/hospital-api'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function HospitalIndexPage() {
    const [hospitals, setHospitals] = useState([])
    const [error, setError] = useState(null)
    const { accessToken, user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchHospitals() {
            try {
                console.log("🔒 Fetching hospitals with token:", accessToken)
                setIsLoading(true)
                const data = await getAllHospitals(accessToken)
                setHospitals(data)
            } catch (err) {
                console.error("❌ Failed to fetch hospitals:", err)
                setError('Failed to load hospitals.')
            } finally {
                setIsLoading(false)
            }
        }

        if (accessToken) {
            fetchHospitals()
        }
    }, [accessToken])

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-10 px-6 md:px-10">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border-t-4 border-emerald-500">
                    {/* Header */}
                    <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Hospitals
                        </h1>
                        <Link
                            to="/hospitals/new"
                            className="bg-white text-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-50 transition font-medium shadow-md flex items-center space-x-2"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            <span>Add Hospital</span>
                        </Link>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                            </div>
                        ) : hospitals.length === 0 && !error ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                <p className="text-gray-500 text-lg">No hospitals found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                                <table className="min-w-full text-sm divide-y divide-gray-200">
                                    <thead className="bg-emerald-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-emerald-700">Name</th>
                                            <th className="px-4 py-3 text-center font-medium text-emerald-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {hospitals.map((hospital) => (
                                            <tr key={hospital.id} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 font-medium text-gray-700">{hospital.name}</td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        to={`/hospitals/${hospital.id}`}
                                                        className="text-emerald-600 hover:text-emerald-800 hover:underline inline-flex items-center"
                                                    >
                                                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
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
                </div>
            </div>
        </div>
    )
}
