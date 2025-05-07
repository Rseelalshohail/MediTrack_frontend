// src/utilities/workorder-api.js
import sendRequest from './sendRequest'

const BASE_URL = '/workorders/'

// Nurses & Admins: full list | Engineers: filtered list
export async function getAllWorkOrders(token, userType) {
    const url = userType === 'engineer' ? `${BASE_URL}assigned/` : BASE_URL
    return sendRequest(url, 'GET', null, token)
}

export async function createWorkOrder(formData, token) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/workorders/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData
    })

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData?.non_field_errors?.[0] || 'Failed to create work order.')
    }

    return res.json()
}


export async function getWorkOrderById(id, token) {
    return sendRequest(`${BASE_URL}${id}/`, 'GET', null, token)
}

export async function updateWorkOrder(id, data, token) {
    return sendRequest(`${BASE_URL}${id}/`, 'PATCH', data, token)
}

export async function deleteWorkOrder(id, token) {
    return sendRequest(`${BASE_URL}${id}/`, 'DELETE', null, token)
}
