import * as express from 'express';
import passport from 'passport';
import {
    ExtractJwt as ExtractJWT,
    Strategy as JWTstrategy
} from 'passport-jwt';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';
import { User } from '../models/User';
import { AccountService } from '../services/AccountService';
import { LoggerInterface, Logger } from '../../decorators/Logger';
interface RequestCustom extends express.Request {
    user: User;
}
import { env } from '../../env';

export class CheckAuthMiddleware implements ExpressMiddlewareInterface {
    constructor(
        @Service() private accountService: AccountService,
        @Logger(__filename) private log: LoggerInterface
    ) {}

    public use(
        req: RequestCustom,
        res: express.Response,
        next: express.NextFunction
    ): any {
        passport.use(
            new JWTstrategy(
                {
                    secretOrKey: env.jwt.jwt_secret,
                    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
                },
                (jwt_object, done) => {
                    this.log.info('jwt_object => ', jwt_object); //jwt_object contains object literal with info from jwt
                    return this.accountService
                        .findOne(jwt_object.id)
                        .then(
                            (account) => done(null, account),
                            (err) => done(err)
                        );
                }
            )
        );
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err) {
                err.code = err.code || 403;
                res.status(err.code).json({
                    code: err.code,
                    message: err.message
                });
            } else if (!user) {
                res.status(401).json({ err: 'User not authorized' });
            } else {
                req.body = user;
                next();
            }
        })(req, res, next);
    }
}
