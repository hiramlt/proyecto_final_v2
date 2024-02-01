import winston from 'winston'
import config from '../config/config'

const customLevelsOpts = {
    levels: {
        fatal: 0,
        error: 1, 
        warning: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
    }
}

export const devLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'verbose' }),
    ]
})

export const prodLogger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'http' }),
        new winston.transports.File({ filename: './errors.log', level: 'warn' })
    ]
})

export const appLogger = (req, res, next) => {
    req.logger = config.env === 'production' ? prodLogger : devLogger
    next()
}