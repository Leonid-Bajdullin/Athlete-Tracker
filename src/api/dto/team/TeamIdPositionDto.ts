import { UserTeam } from 'src/api/models/UserTeam';

export class TeamIdPositionDto {
    constructor(userteam: UserTeam) {
        this.id = userteam.team.id;
        this.position = userteam.position;
    }

    public id: string;
    public position: string;
}
