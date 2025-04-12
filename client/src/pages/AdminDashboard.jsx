import { useEffect, useState } from 'react'
import {
    Box,
    Button,
    Typography,
    Container,
    Paper,
    CssBaseline,
    ThemeProvider,
    createTheme
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import ClientDecodersModal from '../components/ClientDecodersModal'

export default function AdminDashboard() {
    const [clients, setClients] = useState([])
    const [activationKey, setActivationKey] = useState(null)
    const [error, setError] = useState('')
    const [selectedClient, setSelectedClient] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const fetchClients = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/clients', {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            // transformer pour ajouter un champ `id` requis par DataGrid
            const formatted = data.map((client) => {
                const date = new Date(client.createdAt)
                const day = ("0" + date.getDate()).slice(-2)
                const month = ("0" + (date.getMonth() + 1)).slice(-2)
                const year = date.getFullYear()
                const hours = ("0" + date.getHours()).slice(-2)
                const minutes = ("0" + date.getMinutes()).slice(-2)

                return {
                    ...client,
                    id: client._id,
                    createdAt: `${day}/${month}/${year} ${hours}:${minutes}`
                }
            })

            setClients(formatted)
        } catch (err) {
            setError(err.message)
        }
    }

    const generateKey = async () => {
        setActivationKey(null)
        setError('')
        try {
            const res = await fetch('http://localhost:5000/api/admin/generate-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(res)
                throw new Error(data.message)
            }
            setActivationKey(data.key)
        } catch (err) {
            console.log(err)
            setError(err.message)
        }
    }
    const handleDelete = async (id) => {
        const confirm = window.confirm("Voulez-vous vraiment supprimer ce client ?")
        if (!confirm) return

        try {
            const res = await fetch(`http://localhost:5000/api/admin/clients/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            // Met à jour l’UI
            setClients(prev => prev.filter(c => c._id !== id))
        } catch (err) {
            alert("Erreur : " + err.message)
        }
    }


    const columns = [
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
            minWidth: 200,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'createdAt',
            headerName: 'Date de création',
            flex: 1,
            headerAlign: 'center',
            align: 'center'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: "1vh", }}>
                    <Button
                        variant="contained"
                        size="small"
                        color="info"
                        onClick={() => {
                            setSelectedClient(params.row)
                            setModalOpen(true)
                        }}
                    >
                        Détails
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(params.row._id)}
                    >
                        Supprimer
                    </Button>
                </Box>
            )
        }

    ]


    useEffect(() => {
        fetchClients()
    }, [])

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#121212',
                paper: '#1e1e1e'
            },
            primary: {
                main: '#1976d2'
            },
            secondary: {
                main: '#00e676'
            },
            error: {
                main: '#f44336'
            },
            info: {
                main: '#29b6f6'
            }
        }
    })

    return (
        <ThemeProvider theme={darkTheme}

        >
            <CssBaseline />
            <Container maxWidth="250">
                <Box
                    sx={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 3,
                        marginLeft: "70vh"
                    }}
                >
                    <Typography variant="h4" align="center" gutterBottom>
                        🎛️ Tableau de bord - Admin
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={generateKey}
                        sx={{ mb: 2 }}
                    >
                        Générer une clé d’activation
                    </Button>

                    {activationKey && (
                        <Typography align="center" color="secondary" sx={{ mb: 2 }}>
                            Clé générée : <code>{activationKey}</code>
                        </Typography>
                    )}

                    {error && (
                        <Typography align="center" color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%'
                        }}
                    >
                        <Paper
                            elevation={4}
                            sx={{
                                p: 2,
                                backgroundColor: '#1e1e1e',
                                width: 700,
                                mx: 'auto'
                            }}
                        >
                            <DataGrid
                                rows={clients}
                                columns={columns}
                                autoHeight
                                pageSize={5}
                                rowsPerPageOptions={[5]}
                                disableColumnMenu
                                sx={{
                                    color: '#fff',
                                    border: 0,
                                    '& .MuiDataGrid-columnHeaders': {
                                        backgroundColor: '#333'
                                    },
                                    '& .MuiDataGrid-footerContainer': {
                                        backgroundColor: '#1e1e1e'
                                    },
                                    '& .MuiDataGrid-row:hover': {
                                        backgroundColor: '#222'
                                    }
                                }}
                            />
                        </Paper>
                    </Box>
                </Box>
            </Container>
            {selectedClient && (
                <ClientDecodersModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    client={selectedClient}
                    onStatusChange={(address, newStatus) => {
                        const updatedClient = { ...selectedClient }
                        const decoder = updatedClient.decoders.find(d => d.address === address)
                        if (decoder) decoder.status = newStatus
                        setSelectedClient(updatedClient)

                        // 🔥 Ajoute l’appel au backend :
                        fetch(`http://localhost:5000/api/admin/clients/${selectedClient._id}/decoder-status`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + localStorage.getItem('token')
                            },
                            body: JSON.stringify({ address, status: newStatus })
                        })
                            .then(res => res.json())
                            .then(data => console.log(data))
                            .catch(err => console.error('Erreur API:', err))
                    }}
                />
            )}
        </ThemeProvider>

    )
}
