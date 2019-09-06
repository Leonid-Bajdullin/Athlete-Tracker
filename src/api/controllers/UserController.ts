import {
    Body,
    Delete,
    Get,
    JsonController,
    OnUndefined,
    Param,
    Post,
    // UseBefore,
    Put,
    HeaderParam,
    UseBefore
} from 'routing-controllers';

import { UserNotFoundError } from '../errors/UserNotFoundError';
import { User } from '../models/User';
import { UserService } from '../services/UserService';
import { UserCreateDto } from '../dto/user/UserCreateDto';
import { UserProfileChangesDto } from '../dto/user/UserProfileChangesDto';
import { CheckAuthMiddleware } from '../middlewares/CheckAuthMiddlware';
import { TeamIdPositionDto } from '../dto/team/TeamIdPositionDto';

// @Authorized()
@JsonController('/users')
export class UserController {
    constructor(private userService: UserService) {}

    //GET METHODS
    @UseBefore(CheckAuthMiddleware)
    @Get()
    public findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @UseBefore(CheckAuthMiddleware)
    @Get('/:id')
    @OnUndefined(UserNotFoundError)
    public findOne(@Param('id') id: string): Promise<User | undefined> {
        return this.userService.findOne(id);
    }

    // @UseBefore(CheckAuthMiddleware)
    @Get('/currentuser')
    public getCurrentUser(
        @HeaderParam('authorization') token: string
    ): Promise<User> {
        return this.userService.getCurrentUser(token);
    }

    // @UseBefore(CheckAuthMiddleware)
    @Get('/:id/teams')
    public async findUserTeams(
        @Param('id') id: string
    ): Promise<Array<TeamIdPositionDto>> {
        return this.userService.findUserTeams(id);
    }

    // POST METHODS
    @Post()
    public create(@Body() user: UserCreateDto): Promise<User> {
        return this.userService.create(user);
    }

    //PUT METHODS
    @UseBefore(CheckAuthMiddleware)
    @Put('/:id')
    public update(
        @Param('id') id: string,
        @Body() user: UserProfileChangesDto
    ): Promise<User> {
        return this.userService.update(id, user);
    }

    //DELETE METHODS
    @UseBefore(CheckAuthMiddleware)
    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<object> {
        return this.userService.delete(id);
    }
}
