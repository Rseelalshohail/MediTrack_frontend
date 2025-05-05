// src/utilities/sendRequest.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

/**
 * Handles HTTP requests with token support
 */
export default async function sendRequest(url, method = 'GET', body = null, token = null) {
    if (!token) {
        token = localStorage.getItem('access')
        console.log('📦 Retrieved token from localStorage:', token)
    } else {
        console.log('📦 Using passed token:', token)
    }

    const headers = {
        'Content-Type': 'application/json',
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
        console.log('✅ Authorization header set:', headers['Authorization'])
    } else {
        console.warn('🚫 No token set in Authorization header.')
    }

    const cleanedUrl = `${BASE_URL.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
    const options = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
    }

    try {
        const res = await fetch(cleanedUrl, options)
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}))
            throw new Error(errorData.error || `Request failed with status ${res.status}`)
        }
        return await res.json()
    } catch (err) {
        console.error(`❌ API ${method} ${cleanedUrl} failed:`, err)
        throw err
    }
}
