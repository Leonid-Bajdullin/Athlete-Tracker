import { HttpError } from 'routing-controllers';

export class UserNotAuthError extends HttpError {
    constructor() {
        super(401, 'User not authorised!');
    }
}
