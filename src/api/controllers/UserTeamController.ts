import {
    JsonController,
    Post,
    Body,
    Put,
    Delete,
    UseBefore
} from 'routing-controllers';

import { UserTeamService } from '../services/UserTeamService';
import { UserTeam } from '../models/UserTeam';
import { TeamMemberDto } from '../dto/team/TeamMemberDto';
import { CheckAuthMiddleware } from '../middlewares/CheckAuthMiddlware';

@JsonController('/userteams')
export class UserTeamController {
    constructor(private userTeamService: UserTeamService) {}

    @UseBefore(CheckAuthMiddleware)
    @Post('/')
    public insertPendingMember(
        @Body() values: TeamMemberDto
    ): Promise<UserTeam> {
        return this.userTeamService.insertPendingMember(values);
    }

    @UseBefore(CheckAuthMiddleware)
    @Put('/accept')
    public acceptmember(@Body() values: TeamMemberDto): Promise<UserTeam> {
        return this.userTeamService.acceptMember(values);
    }

    @Put('/setposition')
    public setMembersPosition(@Body() data: any) {
        return this.userTeamService.setMembersPosition(data);
    }

    @UseBefore(CheckAuthMiddleware)
    @Delete('/')
    public deleteMember(@Body() values: TeamMemberDto): Promise<object> {
        return this.userTeamService.deleteMember(values);
    }
}
