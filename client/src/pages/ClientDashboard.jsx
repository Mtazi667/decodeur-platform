// src/pages/ClientDashboard.jsx
import { useEffect, useState } from 'react'
import { Container, Grid, Typography } from '@mui/material'
import DecoderCard from '../components/DecoderCard'

export default function ClientDashboard() {
    const [decoders, setDecoders] = useState([])

    const fetchAuthorizedDecoders = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/client/decoders', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setDecoders(data) // tableau de { address, status }
        } catch (err) {
            console.error('Erreur lors du chargement des décodeurs autorisés:', err)
        }
    }

    useEffect(() => {
        fetchAuthorizedDecoders()
    }, [])

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h4" mb={3}>📡 Décodeurs </Typography>
            <Grid container spacing={2}>
                {decoders.map((d) => {
                    console.log(d)
                    return <Grid item xs={12} sm={6} md={4} lg={3} key={d.address} >
                        <DecoderCard address={d.address} />
                    </Grid>
                }
                )}
            </Grid>
        </Container >
    )
}
