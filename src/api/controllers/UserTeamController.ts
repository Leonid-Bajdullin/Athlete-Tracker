import { JsonController, Post, Body } from 'routing-controllers';

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
        // @Body() teamId: string
    ): Promise<UserTeam> {
        return this.userTeamService.insertPendingMember(values);
    }
}
