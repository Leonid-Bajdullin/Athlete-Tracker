import { HttpError } from 'routing-controllers';

export class AccountNotFoundError extends HttpError {
    constructor() {
        super(404, 'Account not found!');
    }
}
