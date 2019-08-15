import { HttpError } from 'routing-controllers';

export class TeamNotFoundError extends HttpError {
    constructor() {
        super(404, 'Team not found!');
    }
}
