const API_BASE_URL = 'http://localhost:5000/api'

export async function loginUser(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur de connexion')
    }

    return response.json()
}
