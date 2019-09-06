import { JsonController, Post, Body, Put, Delete } from 'routing-controllers';

import { UserTeamService } from '../services/UserTeamService';
import { UserTeam } from '../models/UserTeam';
import { TeamMemberDto } from '../dto/team/TeamMemberDto';

// @Authorized()
@JsonController('/userteams')
export class UserTeamController {
    constructor(private userTeamService: UserTeamService) {}

    @Post('/')
    public insertPendingMember(
        @Body() values: TeamMemberDto
    ): Promise<UserTeam> {
        return this.userTeamService.insertPendingMember(values);
    }

    @Put('/')
    public acceptmember(@Body() values: TeamMemberDto): Promise<UserTeam> {
        return this.userTeamService.acceptMember(values);
    }

    @Delete('/')
    public deleteMember(@Body() values: TeamMemberDto): Promise<{}> {
        return this.userTeamService.deleteMember(values);
    }
}
