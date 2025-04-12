import mongoose from 'mongoose'

const activationKeySchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

export default mongoose.model('ActivationKey', activationKeySchema)
