import express from 'express'
import mongoose from 'mongoose'

import path, { dirname } from 'path';

import logger from './middleware/logger.js';
import { port, dbURI } from './config/environment.js'
import gamesController from './controllers/games.js'
import authController from './controllers/auth.js'
import errorHandler from './middleware/errorHandler.js';
import { NotFound } from './lib/errors.js';

const app = express()

// middleware for absolute paths to data as well as file names to be implemented

app.use(express.json())

app.use("/", logger)

app.use('/api', authController)

app.use('/api', gamesController)

app.use(errorHandler)



await mongoose.connect(dbURI)



async function startApp() {
   await mongoose.connect(dbURI)
  console.log('🤖 Successfully connected to mongo!')

  app.listen(port, () => console.log(`🤖 Up and running on port ${port}`))
}


app.get('*', function (req, res) {
  res.status(404).json("404 error route not found")
});


startApp()