import passport from "passport";
import config from "./config.js";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.signedCookies){
        token = req.signedCookies['access_token'];
    }
    return token;
}

export const initPassport = () => {
    const opts = {
        secretOrKey: config.jwt_secret,
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor])
    }

    passport.use('jwt', new JWTStrategy(opts, (payload, done) => {
        return done(null, payload);
    }));
}