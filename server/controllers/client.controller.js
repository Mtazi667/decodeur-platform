import User from '../models/User.js'


export const getAuthorizedDecoders = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) return res.status(404).json({ message: "Utilisateur introuvable" })

        const authorized = user.decoders.filter(d => d.status === "Authorized")
        res.json(authorized)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}
export const addChannelToDecoder = async (req, res) => {
    try {
        const { address } = req.params
        const { channel } = req.body
        const user = await User.findById(req.user.id)

        const decoder = user.decoders.find(d => d.address === address)
        if (!decoder) return res.status(404).json({ message: "Décodeur introuvable" })

        if (!decoder.channels.includes(channel)) {
            decoder.channels.push(channel)
        }

        await user.save()
        res.json({ message: 'Chaîne ajoutée', decoder })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const removeChannelFromDecoder = async (req, res) => {
    try {
        const { address } = req.params
        const { channel } = req.body
        const user = await User.findById(req.user.id)

        const decoder = user.decoders.find(d => d.address === address)
        if (!decoder) return res.status(404).json({ message: "Décodeur introuvable" })

        decoder.channels = decoder.channels.filter(c => c !== channel)

        await user.save()
        res.json({ message: 'Chaîne retirée', decoder })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}