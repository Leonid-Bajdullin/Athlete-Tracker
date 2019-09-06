import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { FindConditions } from 'typeorm';
import { Logger, LoggerInterface } from '../../decorators/Logger';

import { UserTeamRepository } from '../repositories/UserTeamRepository';
import { UserTeam } from '../models/UserTeam';
import { UserRepository } from '../repositories/UserRepository';
import { TeamRepository } from '../repositories/TeamRepository';
import { TeamMemberDto } from '../dto/team/TeamMemberDto';

@Service()
export class UserTeamService {
    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userTeamRepository: UserTeamRepository,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private teamRepository: TeamRepository
    ) {}

    // POST METHODS
    public insertPendingMember = async (
        values: TeamMemberDto
    ): Promise<UserTeam> => {
        const newMember = new UserTeam();
        newMember.user = await this.userRepository.findOne(values.userId);
        newMember.team = await this.teamRepository.findOne(values.teamId);
        newMember.position = 'pending';

        return this.userTeamRepository.save(newMember);
    };

    // PUT METHODS
    public acceptMember = async (values: TeamMemberDto): Promise<UserTeam> => {
        const member = await this.userTeamRepository.findOne({
            where: { user: values.userId, team: values.teamId },
            relations: ['user', 'team']
        });
        member.position = 'athlete';
        return await this.userTeamRepository.save(member);
    };

    public async setMembersPosition(data: any) {
        this.log.info('data =>', data);

        const member = await this.userTeamRepository.findOne({
            where: { user: data.userId, team: data.teamId },
            relations: ['user', 'team']
        });
        member.position = data.position;

        return await this.userTeamRepository.save(member);
    }

    // DELETE METHODS
    public deleteMember = async (values: TeamMemberDto): Promise<object> => {
        await this.userTeamRepository.delete({
            user: values.userId,
            team: values.teamId
        } as FindConditions<UserTeam>);
        const deleteMessage = {
            message: `Successful`
        };
        return deleteMessage;
    };
}
