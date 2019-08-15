import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
// import uuid from 'uuid';

import {
    EventDispatcher,
    EventDispatcherInterface
} from '../../decorators/EventDispatcher';
import { events } from '../subscribers/events';
import { Team } from '../models/Team';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { TeamRepository } from '../repositories/TeamRepository';
import { TeamRequestDto } from '../dto/TeamRequestDto';

@Service()
export class TeamService {
    constructor(
        @OrmRepository() private teamRepository: TeamRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) {}

    public find(): Promise<Team[]> {
        this.log.info('Find all teams');
        return this.teamRepository.find({ relations: ['userTeams'] });
    }

    public findOne(id: string): Promise<Team | undefined> {
        this.log.info('Find one team');
        return this.teamRepository.findOne({ id });
    }

    public async create(team: TeamRequestDto): Promise<Team> {
        this.log.info('Create a new team => ', team);
        // user.id = uuid.v1();
        const newTeam = await this.teamRepository.save(team);
        this.eventDispatcher.dispatch(events.team.created, newTeam);
        return newTeam;
    }

    public update(id: string, team: TeamRequestDto): Promise<Team> {
        this.log.info('Update a team');
        team.id = id;
        return this.teamRepository.save(team);
    }

    public async delete(id: string): Promise<string> {
        this.log.info('Delete a team');
        await this.teamRepository.delete(id);
        const deleteMessage = `Team with teamID=${id} deleted successfully!`;
        return deleteMessage;
    }
}
