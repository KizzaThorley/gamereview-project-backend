import express from 'express'
import Game from '../models/game.js'
import Genre from '../models/genre.js'
import secureRoute from  '../middleware/secureRoute.js'

const router = express.Router()

router.get('/games', secureRoute, async (req, res, next) => {
    try {

        res.send('this router is working')
        
    } catch (error) {
        next(error)
    }
})






export default router