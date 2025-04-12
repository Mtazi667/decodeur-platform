import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import clientRoutes from './routes/client.routes.js'


dotenv.config()

const app = express()

// Middlewares 
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/client', clientRoutes)

// Connexion MongoDB + lancement serveur
const PORT = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`--> http://localhost:${PORT}`))
    })
    .catch(err => console.error('❌ Erreur MongoDB :', err))
