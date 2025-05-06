// src/utilities/sparepart-api.js
import sendRequest from './sendRequest'

const BASE_URL = '/spareparts/'

export function getAllSpareParts(token) {
    return sendRequest(BASE_URL, 'GET', null, token)
}

export function getSparePartById(id, token) {
    return sendRequest(`${BASE_URL}${id}/`, 'GET', null, token)
}

export function createSparePart(data, token) {
    return sendRequest(BASE_URL, 'POST', data, token)
}

export function updateSparePart(id, data, token) {
    return sendRequest(`${BASE_URL}${id}/`, 'PATCH', data, token)
}

export function deleteSparePart(id, token) {
    return sendRequest(`${BASE_URL}${id}/`, 'DELETE', null, token)
}
