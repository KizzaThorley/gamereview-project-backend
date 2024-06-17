import express from 'express'
import Game from '../models/game.js'
import Genre from '../models/genre.js'

const router = express.Router()

router.get('/games', async (req, res, next) => {
    try {

        res.send('this router is working')
        
    } catch (error) {
        next(error)
    }
})




export default router