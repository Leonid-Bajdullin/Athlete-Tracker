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
}
