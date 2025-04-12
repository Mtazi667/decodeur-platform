import {
    Dialog,
    DialogTitle,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip
} from '@mui/material'

export default function ClientDecodersModal({ open, onClose, client, onStatusChange }) {
    const handleToggle = (address, currentStatus) => {
        const newStatus = currentStatus === 'Authorized' ? 'Suspended' : 'Authorized'
        onStatusChange(address, newStatus)
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Décodeurs de {client.email}</DialogTitle>
            <DialogContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Adresse IP</TableCell>
                                <TableCell>Statut</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {client.decoders.map((decoder) => (
                                <TableRow key={decoder.address}>
                                    <TableCell>{decoder.address}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={decoder.status}
                                            color={
                                                decoder.status === 'Authorized' ? 'success' : 'error'
                                            }
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="outlined"
                                            color={decoder.status === 'Authorized' ? 'error' : 'success'}
                                            onClick={() => handleToggle(decoder.address, decoder.status)}
                                        >
                                            {decoder.status === 'Authorized' ? 'Suspendre' : 'Autoriser'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
        </Dialog>
    )
}
