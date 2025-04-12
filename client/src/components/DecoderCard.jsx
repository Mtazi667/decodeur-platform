// src/components/DecoderCard.jsx
import { useEffect, useState } from 'react'
import { Box, Typography, Button, Paper, Stack } from '@mui/material'

export default function DecoderCard({ address }) {
    const [info, setInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

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

            // Refresh après action
            if (['shutdown', 'reinit'].includes(action)) {
                setTimeout(() => sendDecoderAction('info'), 1000)
            }
            else if (['reset'].includes(action)) {
                setTimeout(() => sendDecoderAction('info'), 15000)
                setTimeout(() => sendDecoderAction('info'), 25000)
                setTimeout(() => sendDecoderAction('info'), 30000)
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

    useEffect(() => {
        sendDecoderAction('info')
    }, [])

    const state = info?.state?.toLowerCase()

    if (loading) return <Typography>Chargement...</Typography>

    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                minWidth: 250,
                height: 340,
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

            <Stack
                direction="row"
                spacing={1}
                mt={2}
                justifyContent="center"
                flexWrap="wrap"
                sx={{ minHeight: 60 }}
            >
                <Button
                    size="small"
                    color="info"
                    onClick={() => sendDecoderAction('info')}
                >
                    INFO
                </Button>

                <Button
                    size="small"
                    color="primary"
                    onClick={() => sendDecoderAction('reset')}
                >
                    RESET
                </Button>

                <Button
                    size="small"
                    color="secondary"
                    onClick={() => sendDecoderAction('reinit')}
                >
                    RÉINIT
                </Button>

                <Button
                    size="small"
                    color="error"
                    onClick={() => sendDecoderAction('shutdown')}
                    disabled={state !== 'active'}
                >
                    SHUTDOWN
                </Button>
            </Stack>
        </Paper>
    )
}
