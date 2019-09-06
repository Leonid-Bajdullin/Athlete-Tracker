import { Response } from 'express';
import {
    JsonController,
    Body,
    Post,
    OnUndefined,
    Res
} from 'routing-controllers';
import { UserService } from '../services/UserService';
import { LoginDto } from '../dto/user/LoginDto';
import { UserNotFoundError } from '../errors/UserNotFoundError';

@JsonController('/login')
export class LoginController {
    constructor(private userService: UserService) {}

    @OnUndefined(UserNotFoundError)
    @Post()
    public async login(
        @Body() loginData: LoginDto,
        @Res() response: Response
    ): Promise<any> {
        return await this.userService.login(loginData);
    }
}
