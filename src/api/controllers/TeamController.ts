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
import { TeamRequestDto } from '../dto/team/TeamRequestDto';
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

    @Post()
    public create(@Body() team: TeamRequestDto): Promise<Team> {
        return this.teamService.create(team);
    }

    @Put('/:id')
    public update(
        @Param('id') id: string,
        @Body() team: TeamRequestDto
    ): Promise<Team> {
        return this.teamService.update(id, team);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string): Promise<{}> {
        return this.teamService.delete(id);
    }
}
