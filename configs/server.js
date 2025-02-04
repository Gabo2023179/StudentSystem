"use strict"

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiLimiter from '../src/middlewares/validar-cant-peticiones.js';


const middlewares = (app) =>  {
    app.use(express.urlencoded({extended: false}))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
    app.use(apiLimiter)
}

export const initServer = () => {
    const app = express()
    try {
        middlewares(app)
        console.log(`Server running on port ${process.env.PORT}`)
    } catch (err) {
        console.log(`Server init failed ${err}`)
    }
}