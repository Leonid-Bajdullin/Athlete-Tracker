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
import { TeamRequestDto } from '../dto/team/TeamRequestDto';

@Service()
export class TeamService {
    constructor(
        @OrmRepository() private teamRepository: TeamRepository,
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

    public async create(team: TeamRequestDto): Promise<Team> {
        this.log.info('Create a new team => ', team);
        const newTeam = await this.teamRepository.save(team);

        this.eventDispatcher.dispatch(events.team.created, newTeam);

        return newTeam;
    }

    public async update(id: string, team: TeamRequestDto): Promise<Team> {
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
