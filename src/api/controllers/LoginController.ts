import { JsonController, Body, Post, UseAfter } from 'routing-controllers';
import { CheckAuthMiddleware } from '../middlewares/CheckAuthMiddlware';
import { UserService } from '../services/UserService';
import { LoginDto } from '../dto/user/LoginDto';

@JsonController('/login')
export class LoginController {
    constructor(private userService: UserService) {}

    @UseAfter(CheckAuthMiddleware)
    @Post()
    public login(@Body() loginData: LoginDto): Promise<{}> {
        return this.userService.login(loginData);
    }
}
