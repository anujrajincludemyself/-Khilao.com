const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const userSignUp = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password is required" })
    }
    let user = await User.findOne({ email })
    if (user) {
        return res.status(400).json({ error: "Email is already exist" })
    }
    const hashPwd = await bcrypt.hash(password, 10)
    const newUser = await User.create({
        email, password: hashPwd
    })
    let token = jwt.sign({ email, id: newUser._id }, process.env.SECRET_KEY)
    return res.status(200).json({ token, user:newUser })

}

const userLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password is required" })
    }
    let user = await User.findOne({ email })
    if (user && await bcrypt.compare(password, user.password)) {
        let token = jwt.sign({ email, id: user._id }, process.env.SECRET_KEY)
        return res.status(200).json({ token, user })
    }
    else {
        return res.status(400).json({ error: "Invaild credientials" })
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('email').lean()
        if(!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.set('Cache-Control', 'public, max-age=3600') // Cache for 1 hour
        res.json({email: user.email})
    } catch(error) {
        console.error('Error fetching user:', error)
        return res.status(500).json({ error: 'Failed to fetch user' })
    }
}

module.exports = { userLogin, userSignUp, getUser }