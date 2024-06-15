import express from 'express'
import mongoose from 'mongoose'

import path, { dirname } from 'path';

import { port, dbURI } from './config/environment.js'
import gamesController from './controllers/games.js'
import authController from './controllers/auth.js'

const app = express()

app.use(express.json())

app.use('/api', authController)

app.use('/api', gamesController)



await mongoose.connect(dbURI)



async function startApp() {
   await mongoose.connect(dbURI)
  console.log('🤖 Successfully connected to mongo!')

  app.listen(port, () => console.log(`🤖 Up and running on port ${port}`))
}

startApp()