import express from 'express'
import mongoose from 'mongoose'


import logger from '../../middleware/logger.js';
import { port, dbURI } from '../../config/environment.js'
import gamesController from '../../controllers/games.js'
import authController from '../../controllers/auth.js'
import errorHandler from '../../middleware/errorHandler.js';
import cors from 'cors'
import serverless from 'serverless-http'

const app = express()



app.use(express.json())

app.use(cors())
app.use("/", logger)
app.use('/api', authController)

app.use('/api', gamesController)

app.use(errorHandler)



async function startApp() {
   await mongoose.connect(dbURI)
  console.log('🤖 Successfully connected to mongo!')
}


app.get('*', function (req, res) {
  res.status(404).json("404 error route not found")
});


startApp()

export const handler = serverless(app)