import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import '../config/env.js'
import ActivationKey from '../models/ActivationKey.js'

const JWT_SECRET = process.env.JWT_SECRET


export const register = async (req, res) => {
    try {
        const { email, password, activationKey } = req.body

        if (!activationKey) {
            return res.status(400).json({ message: 'Clé d’activation requise' })
        }

        const keyEntry = await ActivationKey.findOne({ key: activationKey })
        if (!keyEntry || keyEntry.used) {
            return res.status(400).json({ message: 'Clé d’activation invalide ou déjà utilisée' })
        }

        const parentId = keyEntry.createdBy

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email déjà utilisé' })
        }
        const defaultDecoders = Array.from({ length: 12 }, (_, i) => ({
            address: `127.0.10.${i + 1}`,
            status: 'Authorized'
        }))
        const hashed = await bcrypt.hash(password, 10)
        const user = new User({ email, password: hashed, role: 'client', parentId, decoders: defaultDecoders })

        await user.save()

        keyEntry.used = true
        await keyEntry.save()

        res.status(201).json({ message: 'Utilisateur créé avec succès' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' })

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' })
        res.json({ token, user: { email: user.email, role: user.role } })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
