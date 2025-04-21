// src/components/DecoderCard.jsx
import { useEffect, useState } from 'react'
import {
    Typography, Button, Paper, Stack, Box, Chip, TextField
} from '@mui/material'

export default function DecoderCard({ address }) {
    const [info, setInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [channels, setChannels] = useState([])
    const [newChannel, setNewChannel] = useState('')

    const token = localStorage.getItem('token')

    const sendDecoderAction = async (action) => {
        try {
            const res = await fetch('https://wflageol-uqtr.net/decoder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    id: 'TAZM76370200',
                    address,
                    action
                })
            })

            const data = await res.json()
            if (!res.ok || data.response !== 'OK') {
                throw new Error(data.message || 'Erreur inconnue')
            }

            if (action === 'info') {
                setInfo({
                    state: data.state,
                    lastRestart: data.lastRestart,
                    lastReinit: data.lastReinit
                })
            }

            if (['reset', 'shutdown', 'reinit'].includes(action)) {
                setTimeout(() => sendDecoderAction('info'), 1000)
            }

            setError('')
        } catch (err) {
            console.error(err)
            setError(err.message)
            setInfo(null)
        } finally {
            setLoading(false)
        }
    }

    const fetchChannels = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/client/decoders', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            const data = await res.json()
            const decoder = data.find(d => d.address === address)
            setChannels(decoder?.channels || [])
        } catch (err) {
            console.error('Erreur de récupération des chaînes', err)
        }
    }

    const addChannel = async () => {
        if (!newChannel.trim()) return
        try {
            const res = await fetch(`http://localhost:5000/api/client/decoders/${address}/channels`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify({ channel: newChannel })
            })
            const data = await res.json()
            if (res.ok) {
                setChannels(data.decoder.channels)
                setNewChannel('')
            }
        } catch (err) {
            console.error(err)
        }
    }

    const removeChannel = async (channelToRemove) => {
        try {
            const res = await fetch(`http://localhost:5000/api/client/decoders/${address}/channels`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                body: JSON.stringify({ channel: channelToRemove })
            })
            const data = await res.json()
            if (res.ok) {
                setChannels(data.decoder.channels)
            }
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        sendDecoderAction('info')
        fetchChannels()
    }, [])

    const state = info?.state?.toLowerCase()

    if (loading) return <Typography>Chargement...</Typography>

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                minWidth: 250,
                height: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'center',
                border: '2px solid black'
            }}
        >
            <Box>
                <Typography fontWeight="bold">Adresse</Typography>
                <Typography>{address}</Typography>

                <Typography fontWeight="bold" mt={1}>État</Typography>
                {error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <Typography color={state === 'active' ? 'green' : 'red'}>
                        {state === 'active' ? 'Actif' : 'Inactif'}
                    </Typography>
                )}

                <Typography fontWeight="bold" mt={1}>Actif depuis :</Typography>
                <Typography>{info?.lastRestart || '—'}</Typography>

                <Typography fontWeight="bold" mt={1}>Réinitialisé :</Typography>
                <Typography>{info?.lastReinit || '—'}</Typography>
            </Box>

            {/* Affichage des chaînes */}
            <Box mt={2}>
                <Typography fontWeight="bold">Chaînes</Typography>
                <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" mt={1}>
                    {channels.map((channel, index) => (
                        <Chip
                            key={index}
                            label={channel}
                            onDelete={() => removeChannel(channel)}
                            color="primary"
                            size="small"
                        />
                    ))}
                </Stack>

                <Stack direction="row" spacing={1} justifyContent="center" mt={2}>
                    <TextField
                        size="small"
                        label="Ajouter chaîne"
                        value={newChannel}
                        onChange={(e) => setNewChannel(e.target.value)}
                        variant="outlined"
                    />
                    <Button size="small" variant="contained" onClick={addChannel}>+</Button>
                </Stack>
            </Box>

            {/* Boutons d'action */}
            <Stack
                direction="row"
                spacing={1}
                mt={2}
                justifyContent="center"
                flexWrap="wrap"
                sx={{ minHeight: 60 }}
            >
                <Button size="small" color="info" onClick={() => sendDecoderAction('info')}>INFO</Button>
                <Button size="small" color="primary" onClick={() => sendDecoderAction('reset')}>RESET</Button>
                <Button size="small" color="secondary" onClick={() => sendDecoderAction('reinit')} disabled={state !== 'active'}>RÉINIT</Button>
                <Button size="small" color="error" onClick={() => sendDecoderAction('shutdown')} disabled={state !== 'active'}>SHUTDOWN</Button>
            </Stack>
        </Paper>
    )
}
