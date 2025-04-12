import ActivationKey from '../models/ActivationKey.js'
import { nanoid } from 'nanoid'
import User from '../models/User.js'

export const getClientsByAdmin = async (req, res) => {
    try {
        const clients = await User.find({ parentId: req.user.id, role: 'client' }).select('-password')
        res.json(clients)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
export const generateActivationKey = async (req, res) => {
    try {
        const key = `Client-${nanoid(13)}`
        const newKey = new ActivationKey({
            key,
            createdBy: req.user?.id
        })
        await newKey.save()
        res.json({ key })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
export const updateDecoderStatus = async (req, res) => {
    const { clientId } = req.params
    const { address, status } = req.body

    try {
        const user = await User.findById(clientId)
        if (!user || user.role !== 'client') {
            return res.status(404).json({ message: 'Client introuvable.' })
        }

        const decoder = user.decoders.find(d => d.address === address)
        if (!decoder) {
            return res.status(404).json({ message: 'Décodeur introuvable.' })
        }

        decoder.status = status
        await user.save()

        res.json({ message: 'Statut du décodeur mis à jour.', decoder })
    } catch (err) {
        res.status(500).json({ error: 'Erreur serveur.' })
    }
}

export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user || user.role !== 'client') {
            return res.status(404).json({ message: 'Client introuvable' })
        }

        await user.deleteOne()
        res.json({ message: 'Client supprimé avec succès' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
