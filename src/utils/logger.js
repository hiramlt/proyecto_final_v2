import winston from 'winston'
import config from '../config/config.js'

const customLevelsOpts = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white',
    }
}

export const devLogger = winston.createLogger({
    levels: customLevelsOpts.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
              winston.format.colorize({ colors: customLevelsOpts.colors }),
              winston.format.simple(),
            ),
        }),
    ]
})

export const prodLogger = winston.createLogger({
    levels: customLevelsOpts.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'info', 
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOpts.colors }),
                winston.format.simple(),
            ),
        }),
        new winston.transports.File({ 
            filename: './errors.log', 
            level: 'error',
            format: winston.format.simple() 
        })
    ]
})

export const logger = config.env === 'production' ? prodLogger : devLogger

export const appLogger = (req, res, next) => {
    req.logger = logger
    next()
}