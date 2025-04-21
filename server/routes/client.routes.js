import express from 'express'
import { getAuthorizedDecoders } from '../controllers/client.controller.js'
import { verifyToken } from '../middlewares/auth.js'
import User from '../models/User.js'
import { addChannelToDecoder, removeChannelFromDecoder } from '../controllers/client.controller.js'



const router = express.Router()

router.get('/my-decoders', verifyToken, getAuthorizedDecoders)

router.get('/decoders', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user || user.role !== 'client') return res.status(403).json({ message: 'Accès refusé' })

        const authorized = user.decoders.filter(d => d.status === 'Authorized')
        res.json(authorized)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.put('/decoders/:address/channels', verifyToken, addChannelToDecoder)
router.delete('/decoders/:address/channels', verifyToken, removeChannelFromDecoder)

export default router
