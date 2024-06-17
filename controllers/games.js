import express from 'express'
import Game from '../models/game.js'
import Genre from '../models/genre.js'
import secureRoute from  '../middleware/secureRoute.js'
import genresData from "../db/data/genres.js"
import user from '../models/user.js'
import gameGenreMapping from '../db/data/gameGenreMapping.js'
import { ExistingGame, GenreNotFound } from '../lib/errors.js'
import genre from '../models/genre.js'

const router = express.Router()

router.get('/games', async (req, res, next) => {
    try {

        const games = await Game.find().populate("genres")
        res.send(games)
        
    } catch (error) {
        next(error)
    }
})

router.post("/games", secureRoute, async (req, res, next) => {
    try {
        const existingGame = await Game.findOne({ name: (req.body.name.toLocaleLowerCase()) })
        // console.log(req.body.name.toLocaleLowerCase())

        if (existingGame) {
            throw new ExistingGame()
        }


        const genreIds = await Promise.all(req.body.genres.map( async (genre) => {
                const fullGenre = await Genre.findOne({name: genre.toLocaleLowerCase()})
                if (!fullGenre) {
                    throw new GenreNotFound()
                }
                return fullGenre
        }));

        console.log(genreIds)
        req.body.genres = genreIds
       
        
        req.body.name = req.body.name.toLocaleLowerCase()
        req.body.addedBy = res.locals.currentUser
        const createdGame = await Game.create(req.body)

        return res.status(201).json(createdGame)
        
    } catch (error) {
        next(error)
    }
})




export default router