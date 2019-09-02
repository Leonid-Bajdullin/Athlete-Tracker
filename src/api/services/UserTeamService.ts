import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';

import { UserTeamRepository } from '../repositories/UserTeamRepository';
import { UserTeam } from '../models/UserTeam';
import { UserRepository } from '../repositories/UserRepository';
import { TeamRepository } from '../repositories/TeamRepository';
import { TeamJoinRequestDto } from '../dto/team/TeamJoinRequestDto';

@Service()
export class UserTeamService {
    constructor(
        @OrmRepository() private userTeamRepository: UserTeamRepository,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private teamRepository: TeamRepository,
        @Logger(__filename) private log: LoggerInterface
    ) {}

    public insertPendingMember = async (
        values: TeamJoinRequestDto
    ): Promise<UserTeam> => {
        const newMember = new UserTeam();
        newMember.user = await this.userRepository.findOne(values.userId);
        newMember.team = await this.teamRepository.findOne(values.teamId);
        newMember.position = 'pending';
        this.log.info('userId => ', values.userId);
        this.log.info('teamId => ', values.teamId);
        this.log.info(
            'user => ',
            await this.userRepository.findOne(values.userId)
        );
        return this.userTeamRepository.save(newMember);
    };

    public acceptMember = async (
        values: TeamJoinRequestDto
    ): Promise<UserTeam> => {
        const member = await this.userTeamRepository.findOne({
            where: { user: values.userId, team: values.teamId },
            relations: ['user', 'team']
        });
        member.position = 'athlete';
        this.log.info('member => ', member);
        return await this.userTeamRepository.save(member);
    };

    public declineMember = async (values: TeamJoinRequestDto): Promise<{}> => {
        const member = await this.userTeamRepository.findOne({
            where: { user: values.userId, team: values.teamId }
        });
        await this.userTeamRepository.delete(member);
        const deleteMessage = {
            message: `User with id: ${values.userId} successfully declined from team id: ${values.teamId}!`
        };
        return deleteMessage;
    };
}
