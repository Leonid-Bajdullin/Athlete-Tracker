import {
    Body,
    Get,
    Put,
    Delete,
    JsonController,
    Post,
    OnUndefined,
    Param,
    UseBefore
} from 'routing-controllers';

import { Team } from '../models/Team';
import { TeamService } from '../services/TeamService';
import { TeamCreateDto } from '../dto/team/TeamCreateDto';
import { TeamNotFoundError } from '../errors/TeamNotFoundError';
import { CheckAuthMiddleware } from '../middlewares/CheckAuthMiddlware';

@JsonController('/teams')
export class TeamController {
    constructor(private teamService: TeamService) {}

    // GET METHODS
    @Get()
    public find(): Promise<Team[]> {
        return this.teamService.findAll();
    }

    @UseBefore(CheckAuthMiddleware)
    @Get('/:id')
    @OnUndefined(TeamNotFoundError)
    public findOne(@Param('id') id: string): Promise<Team | undefined> {
        return this.teamService.findOne(id);
    }

    @UseBefore(CheckAuthMiddleware)
    @Get('/:id/members')
    public findMembers(@Param('id') id: string): Promise<any[]> {
        return this.teamService.findMembers(id);
    }

    @UseBefore(CheckAuthMiddleware)
    @Get('/:id/pendingmembers')
    public findPendingMembers(@Param('id') id: string): Promise<any[]> {
        return this.teamService.findPendingMembers(id);
    }

    // POST METHODS
    @UseBefore(CheckAuthMiddleware)
    @Post()
    public create(@Body() data: TeamCreateDto): Promise<Team> {
        return this.teamService.create(data);
    }

    // PUT METHODS
    @UseBefore(CheckAuthMiddleware)
    @Put('/:id')
    public update(
        @Param('id') id: string,
        @Body() team: TeamCreateDto
    ): Promise<Team> {
        return this.teamService.update(id, team);
    }

    // DELETE METHODS
    @UseBefore(CheckAuthMiddleware)
    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<object> {
        return this.teamService.delete(id);
    }
}
