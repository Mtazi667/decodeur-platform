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