import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createHospital, getHospitalById, updateHospital } from '../../utilities/hospital-api'

export default function HospitalFormPage() {
    const [formData, setFormData] = useState({ name: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { id } = useParams()

    useEffect(() => {
        if (id) {
            async function fetchHospital() {
                try {
                    const hospital = await getHospitalById(id)
                    setFormData({ name: hospital.name })
                } catch (err) {
                    setError('Failed to load hospital data.')
                }
            }
            fetchHospital()
        }
    }, [id])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (id) {
                await updateHospital(id, formData)
            } else {
                await createHospital(formData)
            }
            navigate('/hospitals')
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
                    {id ? 'Edit Hospital' : 'Add New Hospital'}
                </h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-emerald-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold"
                    >
                        {loading ? 'Saving...' : id ? 'Update Hospital' : 'Create Hospital'}
                    </button>
                </form>
            </div>
        </div>
    )
}
