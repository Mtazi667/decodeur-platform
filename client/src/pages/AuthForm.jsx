import { useState } from 'react'
import { loginUser } from '../services/api'

export default function AuthForm() {
    const [mode, setMode] = useState('login') // login | register
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [activationKey, setActivationKey] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        setError('')
        try {
            if (mode === 'login') {
                const data = await loginUser({ email, password })
                localStorage.setItem('token', data.token)
                setMessage('Connexion réussie !')
                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        window.location.href = '/admin'
                    } else {
                        window.location.href = '/client'
                    }
                }, 1000)
            } else {
                const res = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, activationKey })
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.message)
                setMessage('Inscription réussie ! Vous pouvez vous connecter.')
                setMode('login')
                setActivationKey('')
            }
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                background: '#1e1e1e',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                width: '300px'
            }}>
                <h2>{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    {mode === 'register' && (
                        <input
                            type="text"
                            placeholder="Clé d’activation"
                            value={activationKey}
                            onChange={(e) => setActivationKey(e.target.value)}
                            required
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    )}
                    <button type="submit" style={{ width: '100%' }}>
                        {mode === 'login' ? 'Se connecter' : "S'inscrire"}
                    </button>
                </form>
                <p style={{ marginTop: '1rem' }}>
                    {mode === 'login' ? (
                        <>
                            Pas encore inscrit ?{' '}
                            <span
                                style={{ color: '#4ea5f7', cursor: 'pointer' }}
                                onClick={() => {
                                    setMode('register')
                                    setMessage('')
                                    setError('')
                                }}
                            >
                                Inscrivez-vous
                            </span>
                        </>
                    ) : (
                        <>
                            Déjà un compte ?{' '}
                            <span
                                style={{ color: '#4ea5f7', cursor: 'pointer' }}
                                onClick={() => {
                                    setMode('login')
                                    setMessage('')
                                    setError('')
                                }}
                            >
                                Connectez-vous
                            </span>
                        </>
                    )}
                </p>
                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    )
}
