import {
    Body,
    Delete,
    Get,
    JsonController,
    OnUndefined,
    Param,
    Post,
    Req,
    UseBefore
} from 'routing-controllers';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { UserRequestDto } from '../dto/UserRequestDto';
import { CheckAuthMiddleware } from '../middlewares/CheckAuthMiddlware';

// @Authorized()
@JsonController('/users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseBefore(CheckAuthMiddleware)
    @Get()
    public find(): Promise<User[]> {
        return this.userService.find();
    }

    @Get('/me')
    public findMe(@Req() req: any): Promise<User[]> {
        return req.user;
    }

    @Get('/:id')
    @OnUndefined(UserNotFoundError)
    public findOne(@Param('id') id: string): Promise<User | undefined> {
        return this.userService.findOne(id);
    }

    @Post()
    public create(@Body() user: UserRequestDto): Promise<User> {
        return this.userService.create(user);
    }

    // @Put('/:id')
    // public update(
    //     @Param('id') id: string,
    //     @Body() user: UserRequestDto
    // ): Promise<User> {
    //     return this.userService.update(id, user);
    // }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<{}> {
        return this.userService.delete(id);
    }
}
