import express from 'express'
import { getClientsByAdmin, generateActivationKey } from '../controllers/admin.controller.js'
import { verifyToken, isAdmin } from '../middlewares/auth.js'
import { updateDecoderStatus } from '../controllers/admin.controller.js'

import { deleteClient } from '../controllers/admin.controller.js'



const router = express.Router()

router.post('/generate-key', verifyToken, isAdmin, generateActivationKey)
router.get('/clients', verifyToken, isAdmin, getClientsByAdmin)
router.put(
    '/clients/:clientId/decoder-status',
    verifyToken,
    isAdmin,
    updateDecoderStatus
)
router.delete('/clients/:id', verifyToken, deleteClient)
export default router
