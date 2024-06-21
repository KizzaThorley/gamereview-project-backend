import express from 'express'
import Game from '../models/game.js'
import Genre from '../models/genre.js'
import secureRoute from '../middleware/secureRoute.js'
import User from '../models/user.js'
import { ExistingGame, GenreNotFound, NotFound, Unauthorized, CantReviewTwice, Required } from '../lib/errors.js'
import genre from '../models/genre.js'


const router = express.Router()

router.get('/games', async (req, res, next) => {
    try {


        const games = await Game.find().populate("genres")
        res.status(200).json(games)

    } catch (error) {
        next(error)
    }
})

router.get('/my-games', secureRoute, async (req, res, next) => {
    try {


        const games = await Game.find().populate("genres")

        const filteredGames = games.filter((game) => {
            if (game.addedBy.equals(res.locals.currentUser._id)) return true 
        })
        // if(filteredGames.length === 0) {
    
        // }

        res.status(200).json(filteredGames)

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


router.get("/games/:gameId", async (req, res, next) => {
    try {
        const gameToShow = await Game.findById(req.params.gameId).populate("genres")

        if (!gameToShow) throw new NotFound()

        return res.status(200).json(gameToShow)

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
      
        const gameToUpdate = await Game.findById(req.params.gameId).populate("genres")
    

        if (!gameToUpdate) throw new NotFound()
        const currentUser = await User.findById(res.locals.currentUser._id.toString())


        if (!gameToUpdate.addedBy.equals(res.locals.currentUser._id) ||!currentUser.isAdmin) {
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


router.post('/games/:gameId/reviews', secureRoute, async (req, res, next) => {

    try {
        const gameToReview = await Game.findById(req.params.gameId)
        console.log(gameToReview);
        req.body.addedBy = res.locals.currentUser._id

        if (gameToReview.reviews.length > 0) {
            gameToReview.reviews.forEach((review) => {
                if (review.addedBy.equals(res.locals.currentUser._id)) throw new CantReviewTwice()
            }
            )
        }

        if (req.body.review.trim() === '' || req.body.rating === 0) {
            throw new Required()
        } 

        gameToReview.reviews.push(req.body)

        await gameToReview.save()


        return res.status(202).json(gameToReview)

    } catch (error) {
        next(error)
    }

})

router.put('/games/:gameId/reviews/:reviewId', secureRoute, async (req, res, next) => {

    try {
        const gameToReview = await Game.findById(req.params.gameId).populate("genres")
        const review = gameToReview.reviews.id(req.params.reviewId)

        if (!review.addedBy.equals(res.locals.currentUser._id)) throw new Unauthorized()


        Object.assign(review, req.body)

        await gameToReview.save()

        return res.status(202).json(gameToReview)

    } catch (error) {
        next(error)
    }

})

router.delete('/games/:gameId/reviews/:reviewId/delete', secureRoute, async (req, res, next) => {


    try {

        const gameToReview = await Game.findById(req.params.gameId).populate("genres")
        const review = gameToReview.reviews.id(req.params.reviewId)


        if (!gameToReview) throw new NotFound()

        if (!review) throw new NotFound()

        const currentUser = await User.findById(res.locals.currentUser._id.toString())

        if (currentUser.isAdmin || review.addedBy.equals(res.locals.currentUser._id)) {

            review.deleteOne()

        } else {
            throw new Unauthorized()
        }


        await gameToReview.save()

        return res.status(202).json(gameToReview)

    } catch (error) {
        next(error)
    }

})


router.get('/genres', async (req, res, next) => {
    try {

        const genres = await Genre.find()
        // console.log(genres);
        res.status(200).json(genres)

    } catch (error) {
        next(error)
    }
})

export default router