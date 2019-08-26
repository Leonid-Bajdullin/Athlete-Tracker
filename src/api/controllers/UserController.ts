import {
    Body,
    Delete,
    Get,
    JsonController,
    OnUndefined,
    Param,
    Post,
    // UseBefore,
    Put
} from 'routing-controllers';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { UserCreateDto } from '../dto/user/UserCreateDto';
import { UserSubmitChangesDto } from '../dto/user/UserSubmitChangesDto';
// import { CheckAuthMiddleware } from '../middlewares/CheckAuthMiddlware';

// @Authorized()
@JsonController('/users')
export class UserController {
    constructor(private userService: UserService) {}

    // @UseBefore(CheckAuthMiddleware)
    @Get()
    public findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    // @Get('/me')
    // public findMe(@Req() req: any): Promise<User[]> {
    //     return req.user;
    // }

    @Get('/:id')
    @OnUndefined(UserNotFoundError)
    public findOne(@Param('id') id: string): Promise<User | undefined> {
        return this.userService.findOne(id);
    }

    @Post()
    public create(@Body() user: UserCreateDto): Promise<User> {
        return this.userService.create(user);
    }

    @Put('/:id')
    public update(
        @Param('id') id: string,
        @Body() user: UserSubmitChangesDto
    ): Promise<User> {
        return this.userService.update(id, user);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<{}> {
        return this.userService.delete(id);
    }
}
