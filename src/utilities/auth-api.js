const BASE_URL = 'http://localhost:8000/api'

export async function signupUser({ username, email, password, role }) {
    const roleEndpoint = {
        admin: 'signup/admin/',
        engineer: 'signup/engineer/',
        nurse: 'signup/nurse/',
    }[role]

    const res = await fetch(`${BASE_URL}/${roleEndpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    })

    if (!res.ok) throw new Error('Signup failed')
    return await res.json()
}

export async function loginUser({ username, password }) {
    const res = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    if (!res.ok) throw new Error('Login failed')
    return await res.json()
}

