// src/utilities/workorder-api.js
import sendRequest from './sendRequest'

const BASE_URL = '/workorders/'

// Nurses & Admins: full list | Engineers: filtered list
export async function getAllWorkOrders(token, userType) {
    const url = userType === 'engineer' ? `${BASE_URL}assigned/` : BASE_URL
    return sendRequest(url, 'GET', null, token)
}

export async function createWorkOrder(data, token) {
    return sendRequest(BASE_URL, 'POST', data, token)
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
