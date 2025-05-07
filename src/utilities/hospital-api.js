import sendRequest from './sendRequest'

const ENDPOINT = '/hospitals/'

export async function getAllHospitals(token) {
    return sendRequest(ENDPOINT, 'GET', null, token)
}

export async function getHospitalById(id, token) {
    return sendRequest(`${ENDPOINT}${id}/`, 'GET', null, token)
}

export async function createHospital(data, token) {
    return sendRequest(ENDPOINT, 'POST', data, token)
}

export async function updateHospital(id, data, token) {
    return sendRequest(`${ENDPOINT}${id}/`, 'PUT', data, token)
}

export async function deleteHospital(id, token) {
    return sendRequest(`/hospitals/${id}/`, 'DELETE', null, token)
}