import {
    Body,
    Get,
    Put,
    Delete,
    JsonController,
    Post,
    OnUndefined,
    Param
} from 'routing-controllers';

import { Team } from '../models/Team';
import { TeamService } from '../services/TeamService';
import { TeamCreateDto } from '../dto/team/TeamCreateDto';
import { TeamNotFoundError } from '../errors/TeamNotFoundError';

// @Authorized()
@JsonController('/teams')
export class TeamController {
    constructor(private teamService: TeamService) {}

    @Get()
    public find(): Promise<Team[]> {
        return this.teamService.findAll();
    }

    @Get('/:id')
    @OnUndefined(TeamNotFoundError)
    public findOne(@Param('id') id: string): Promise<Team | undefined> {
        return this.teamService.findOne(id);
    }

    @Get('/members/:id')
    public findMembers(@Param('id') id: string): Promise<Array<any>> {
        return this.teamService.findMembers(id);
    }

    @Get('/pendingmembers/:id')
    public findPendingMembers(@Param('id') id: string): Promise<Array<any>> {
        return this.teamService.findPendingMembers(id);
    }

    @Post()
    public create(@Body() data: TeamCreateDto): Promise<Team> {
        return this.teamService.create(data);
    }

    @Put('/:id')
    public update(
        @Param('id') id: string,
        @Body() team: TeamCreateDto
    ): Promise<Team> {
        return this.teamService.update(id, team);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<{}> {
        return this.teamService.delete(id);
    }
}
