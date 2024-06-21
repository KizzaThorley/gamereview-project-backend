import mongoose from 'mongoose';
import gamesData from './data/games.js'
import User from '../models/user.js';
import Genre from "../models/genre.js"
import { adminPassword, dbURI } from '../config/environment.js'
import genresData from './data/genres.js';
import Game from '../models/game.js';
import gameGenreMapping from './data/gameGenreMapping.js';

async function seed() {
    await mongoose.connect(dbURI)
    console.log("Connected!")

    mongoose.connection.db.dropDatabase()

    const user = await User.create({
        username: "admin",
        password: adminPassword,
        email: "admin@admin.com",
        isAdmin: true
    })
    console.log("user created");

    const genres = await Genre.create(genresData)
    console.log("genres created");

    // uses reduce to provide the specific id for each genre name 
    const genreMap = genres.reduce((acc, genre) => {
        acc[genre.name] = genre._id;
        return acc;
    }, {});


    // foreach through the game data to set the array of genres with their respective ids.
    gamesData.forEach(game => {
        game.addedBy = user._id;
        const genreNames = gameGenreMapping[game.name] || [];
        game.genres = genreNames.map(name => genreMap[name]).filter(Boolean);
    });

    // console.log(gamesData);
   
    const games = await Game.create(gamesData)

    mongoose.disconnect()
    console.log("Disconnected!")
}

seed()

// console.log(gamesData);