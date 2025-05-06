import sendRequest from './sendRequest'

const BASE_URL = '/devices/'

export async function getAllDevices(token) {
    return sendRequest(BASE_URL, 'GET', null, token)
}

export async function getDeviceById(id, token) {
    return sendRequest(`${BASE_URL}${id}/`, 'GET', null, token)
}

export async function createDevice(data, token) {
    return sendRequest(BASE_URL, 'POST', data, token)
}

export async function updateDevice(id, data, token) {
    return sendRequest(`${BASE_URL}${id}/`, 'PUT', data, token)
}

export async function getAllRooms(token) {
    return sendRequest('/rooms/', 'GET', null, token)
}

export async function getAllEngineers(token) {
    return sendRequest('/users/?type=engineer', 'GET', null, token)
}

export async function getAllNurses(token) {
    return sendRequest('/users/?type=nurse', 'GET', null, token)
}

export async function getAssignedDevices(token) {
    return sendRequest('/devices/assigned/', 'GET', null, token)
}


