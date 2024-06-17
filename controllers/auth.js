import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { secret } from '../config/environment.js'
import { PasswordTooWeak, PasswordsNotMatching, Unauthorized } from '../lib/errors.js'

const router = express.Router()

router.post('/signup', async (req, res, next) => {
    try {
        if (req.body.password !== req.body.passwordConfirmation) {
            throw new PasswordsNotMatching()
        }

        const passwordStrength = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(req.body.password)
        console.log(req.body.password);
        console.log(passwordStrength);

        if (!passwordStrength) {
            throw new PasswordTooWeak()
        }

        const user = await User.create(req.body)


        res.status(201).json({
            message: `Thank you for signing up ${user.username}`
        })

    } catch (error) {
        next(error)
    }
})


router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            throw new Unauthorized()
        }

        const passwordCheck = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (!passwordCheck) {
            throw new Unauthorized()
        }

        const token = jwt.sign(
            {
                username: user.username,
                userId: user._id,
            },
            secret,
            {
                expiresIn: '14d',
            }
        )

        res.send({
            message: 'hi',
            token: token
        })

    } catch (error) {
        next(error)
    }
})


export default router