import { useEffect, useState } from 'react'

export default function NurseDashboard() {
    const [data, setData] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('access')
                const response = await fetch('http://localhost:8000/api/dashboard/nurse/', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })

                if (!response.ok) throw new Error('Failed to fetch nurse dashboard data')

                const json = await response.json()
                setData(json)
            } catch (err) {
                setError(err.message)
            }
        }

        fetchData()
    }, [])

    if (error) return <div className="text-red-600 text-center mt-10">{error}</div>
    if (!data) return <div className="text-gray-500 text-center mt-10">Loading...</div>

    return (
        <div className="p-8 min-h-screen bg-emerald-50">
            <h1 className="text-3xl font-bold text-emerald-700 mb-6">Nurse Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-emerald-400">
                    <h2 className="text-lg font-semibold text-gray-700">Total Work Orders</h2>
                    <p className="text-3xl font-bold text-emerald-700">{data.total_work_orders}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-yellow-400">
                    <h2 className="text-lg font-semibold text-gray-700">Open</h2>
                    <p className="text-3xl font-bold text-yellow-600">{data.open}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-blue-400">
                    <h2 className="text-lg font-semibold text-gray-700">In Progress</h2>
                    <p className="text-3xl font-bold text-blue-600">{data.in_progress}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border-t-4 border-green-400">
                    <h2 className="text-lg font-semibold text-gray-700">Closed</h2>
                    <p className="text-3xl font-bold text-green-600">{data.closed}</p>
                </div>
            </div>
        </div>
    )
}
