import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client'
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  decoders: [
    {
      address: String,
      status: {
        type: String,
        enum: ['Authorized', 'Suspended'],
        default: 'Authorized'
      }
    }
  ]
}, { timestamps: true })

export default mongoose.model('User', userSchema)
