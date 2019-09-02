import { JsonController, Post, Body, Put, Delete } from 'routing-controllers';

import { UserTeamService } from '../services/UserTeamService';
import { UserTeam } from '../models/UserTeam';
import { TeamJoinRequestDto } from '../dto/team/TeamJoinRequestDto';

// @Authorized()
@JsonController('/userteams')
export class UserTeamController {
    constructor(private userTeamService: UserTeamService) {}

    @Post('/')
    public insertPendingMember(
        @Body() values: TeamJoinRequestDto
    ): Promise<UserTeam> {
        return this.userTeamService.insertPendingMember(values);
    }

    @Put('/')
    public acceptmember(@Body() values: TeamJoinRequestDto): Promise<UserTeam> {
        return this.userTeamService.acceptMember(values);
    }

    @Delete('/')
    public declineMember(@Body() values: TeamJoinRequestDto): Promise<{}> {
        return this.userTeamService.declineMember(values);
    }
}
