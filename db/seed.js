import mongoose from 'mongoose';
import gamesData from './data/games.js'
import User from '../models/user.js';
import Genre from "../models/genre.js"
import { dbURI } from '../config/environment.js'
import genresData from './data/genres.js';

async function seed() {
    await mongoose.connect(dbURI)
    console.log("Connected!")

    mongoose.connection.db.dropDatabase()

    const user = await User.create({
        username: "admin",
        password: "admin",
        email: "admin@admin.com",
        isAdmin: true
    })

    const genres = await Genre.create(genresData)

    gamesData.forEach((game) => {
        game.addedBy = user._id
    })

    console.log(gamesData)

    mongoose.disconnect()
    console.log("Disconnected!")
}

seed()

// console.log(gamesData);