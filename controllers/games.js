import express from 'express'
import Game from '../models/game.js'
import Genre from '../models/genre.js'
import secureRoute from '../middleware/secureRoute.js'
import User from '../models/user.js'
import { ExistingGame, GenreNotFound, NotFound, Unauthorized } from '../lib/errors.js'
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


        const genreIds = await Promise.all(req.body.genres.map(async (genre) => {
            const fullGenre = await Genre.findOne({ name: genre.toLocaleLowerCase() })
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


router.delete('/games/:gameId', secureRoute, async (req, res, next) => {
    console.log(res.locals.currentUser._id);
    try {
        const gameToDelete = await Game.findById(req.params.gameId)

        if (!gameToDelete) throw new NotFound()

        const currentUser = await User.findById(res.locals.currentUser._id.toString())

        if (currentUser.isAdmin) {
            await gameToDelete.deleteOne()
            return res.status(204).end()
        }
        if (!gameToDelete.addedBy.equals(res.locals.currentUser._id)) {
            throw new Unauthorized()
        }

        await gameToDelete.deleteOne()

        return res.status(204).end()
    } catch (error) {
        next(error)
    }

})

router.put('/games/:gameId', secureRoute, async (req, res, next) => {
    try {
        const gameToUpdate = await Game.findById(req.params.gameId)


        if (!gameToUpdate) throw new NotFound()
            const currentUser = await User.findById(res.locals.currentUser._id.toString())

        if (currentUser.isAdmin) {
            await gameToDelete.deleteOne()
            return res.status(204).end()
        }
        if (!gameToUpdate.addedBy.equals(res.locals.currentUser._id)) {
            throw new Unauthorized()
        }

        const genreIds = await Promise.all(req.body.genres.map(async (genre) => {
            const fullGenre = await Genre.findOne({ name: genre.toLocaleLowerCase() })
            if (!fullGenre) {
                throw new GenreNotFound()
            }
            return fullGenre
        }));

        req.body.genres = genreIds

        Object.assign(gameToUpdate, req.body);
        await gameToUpdate.save();

        return res.status(202).json(gameToUpdate)

    } catch (error) {
        next(error)
    }

})



export default router