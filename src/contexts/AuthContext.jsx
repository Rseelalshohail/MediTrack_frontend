import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [accessToken, setAccessToken] = useState(null)
    const [refreshToken, setRefreshToken] = useState(null)
    const [isAuthChecked, setIsAuthChecked] = useState(false) // ✅ NEW

    useEffect(() => {
        const storedAccess = localStorage.getItem('access')
        const storedRefresh = localStorage.getItem('refresh')
        const storedUserType = localStorage.getItem('user_type')
        const storedUsername = localStorage.getItem('username')
        const storedUserId = localStorage.getItem('user_id')

        if (storedAccess && storedRefresh && storedUserType && storedUsername && storedUserId) {
            setUser({
                username: storedUsername,
                user_type: storedUserType,
                user_id: storedUserId
            })
            setAccessToken(storedAccess)
            setRefreshToken(storedRefresh)
        }

        setIsAuthChecked(true) // ✅ Only after checking
    }, [])

    const login = (userData) => {
        const userObj = {
            username: userData.username,
            user_type: userData.user_type,
            user_id: userData.user_id
        }

        setUser(userObj)
        setAccessToken(userData.access)
        setRefreshToken(userData.refresh)

        localStorage.setItem('access', userData.access)
        localStorage.setItem('refresh', userData.refresh)
        localStorage.setItem('username', userData.username)
        localStorage.setItem('user_type', userData.user_type)
        localStorage.setItem('user_id', userData.user_id)
    }

    const logout = () => {
        setUser(null)
        setAccessToken(null)
        setRefreshToken(null)
        localStorage.clear()
    }

    return (
        <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, isAuthChecked }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
