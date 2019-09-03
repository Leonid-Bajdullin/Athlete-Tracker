import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import _ from 'lodash';

import {
    EventDispatcher,
    EventDispatcherInterface
} from '../../decorators/EventDispatcher';
import { events } from '../subscribers/events';
import { Team } from '../models/Team';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { TeamRepository } from '../repositories/TeamRepository';
import { TeamCreateDto } from '../dto/team/TeamCreateDto';
import { UserTeamRepository } from '../repositories/UserTeamRepository';
import { UserRepository } from '../repositories/UserRepository';
import { UserTeam } from '../models/UserTeam';

@Service()
export class TeamService {
    constructor(
        @OrmRepository() private teamRepository: TeamRepository,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private userTeamRepository: UserTeamRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) {}

    public findAll(): Promise<Team[]> {
        this.log.info('Find all teams');
        return this.teamRepository.find({
            relations: ['userTeams', 'userTeams.user']
        });
    }

    public findOne(id: string): Promise<Team | undefined> {
        this.log.info('Find one team');
        return this.teamRepository.findOne({
            where: { id }
        });
    }

    public async findMembers(id: string): Promise<Array<any>> {
        const team = await this.teamRepository.findOne({
            where: { id },
            relations: ['userTeams', 'userTeams.user']
        });

        const filteredMembers = _.filter(team.userTeams, (item) => {
            return item.position !== 'pending';
        });
        return filteredMembers;
    }

    public async findPendingMembers(id: string): Promise<Array<any>> {
        const team = await this.teamRepository.findOne({
            where: { id },
            relations: ['userTeams', 'userTeams.user']
        });

        const pendingMembers = _.filter(team.userTeams, (item) => {
            return item.position === 'pending';
        });
        return pendingMembers;
    }

    public async create(data: TeamCreateDto): Promise<Team> {
        const { userId, name, description, photoUrl } = data;
        const newTeam = new Team();
        newTeam.name = name;
        newTeam.description = description;
        newTeam.photoUrl = photoUrl;
        const createdTeam = await this.teamRepository.save(newTeam);

        const user = await this.userRepository.findOne(userId);
        const userTeam = new UserTeam();
        userTeam.user = user;
        userTeam.team = newTeam;
        userTeam.position = 'headcoach';
        await this.userTeamRepository.save(userTeam);
        this.log.info('user => ', await this.userRepository.findOne(userId));
        this.log.info('team => ', createdTeam);
        this.log.info(
            'userTeam => ',
            await this.userTeamRepository.save(userTeam)
        );
        this.eventDispatcher.dispatch(events.team.created, newTeam);
        return createdTeam;
    }

    public async update(id: string, team: TeamCreateDto): Promise<Team> {
        const updatedTeam = Object.assign(await this.findOne(id), team);
        return await this.teamRepository.save(updatedTeam);
    }

    public async delete(id: string): Promise<{}> {
        this.log.info('Delete a team');
        await this.teamRepository.delete(id);
        const deleteMessage = {
            message: `Team with TeamID=${id} deleted successfully!`
        };
        return deleteMessage;
    }
}
