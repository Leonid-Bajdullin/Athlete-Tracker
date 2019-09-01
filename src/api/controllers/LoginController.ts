import { JsonController, Body, Post, OnUndefined } from 'routing-controllers';
// import { CheckAuthMiddleware } from '../middlewares/CheckAuthMiddlware';
import { UserService } from '../services/UserService';
import { LoginDto } from '../dto/user/LoginDto';
import { UserNotFoundError } from '../errors/UserNotFoundError';

@JsonController('/login')
export class LoginController {
    constructor(private userService: UserService) {}

    // @UseAfter(CheckAuthMiddleware)
    @OnUndefined(UserNotFoundError)
    @Post()
    public login(@Body() loginData: LoginDto): Promise<{}> {
        return this.userService.login(loginData);
    }
}
