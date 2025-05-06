import sendRequest from './sendRequest'

const ENDPOINT = '/rooms/'

export async function getAllRooms(token) {
    return sendRequest(ENDPOINT, 'GET', null, token)
}

export async function getRoomById(id, token) {
    return sendRequest(`${ENDPOINT}${id}/`, 'GET', null, token)
}

export async function createRoom(data, token) {
    return sendRequest(ENDPOINT, 'POST', data, token)
}

export async function updateRoom(id, data, token) {
    return sendRequest(`${ENDPOINT}${id}/`, 'PUT', data, token)
}
