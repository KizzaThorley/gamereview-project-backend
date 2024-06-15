import express from 'express'
import User from '../models/user.js'

const router = express.Router()

router.get('/signup', async (req, res) => {
    try {
        if (req.body.password !== req.body.passwordConfirmation) {
            throw new Error('passwords dont match')
        }

        const passwordStrength = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(req.body.password)
        console.log(req.body.password);
        console.log(passwordStrength);

        if (!passwordStrength) {
            throw new Error('Your Password need to have a captial be 8 characters long with a special character')
        }
        
        if (!req.body.email) {
            throw new Error('an email is required')
        }

        const user = await User.create(req.body)


        res.status(201).json({
            message: `Thank you for signing up ${user.username}`
        })
        
    } catch (error) {
        res.send(error.message)
    }
})


export default router