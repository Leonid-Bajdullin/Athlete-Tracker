import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import _ from 'lodash';

import { Team } from '../models/Team';
// import { Logger, LoggerInterface } from '../../decorators/Logger';
import { TeamRepository } from '../repositories/TeamRepository';
import { TeamCreateDto } from '../dto/team/TeamCreateDto';
import { UserTeamRepository } from '../repositories/UserTeamRepository';
import { UserRepository } from '../repositories/UserRepository';
import { UserTeam } from '../models/UserTeam';

@Service()
export class TeamService {
    constructor(
        // @Logger(__filename) private log: LoggerInterface
        @OrmRepository() private teamRepository: TeamRepository,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private userTeamRepository: UserTeamRepository
    ) {}

    // GET METHODS
    public findAll(): Promise<Team[]> {
        return this.teamRepository.find({
            relations: ['userTeams']
        });
    }

    public findOne(id: string): Promise<Team | undefined> {
        return this.teamRepository.findOne({
            where: { id }
        });
    }

    public async findMembers(id: string): Promise<any[]> {
        const team = await this.teamRepository.findOne({
            where: { id },
            relations: ['userTeams', 'userTeams.user']
        });

        const filteredMembers = _.filter(team.userTeams, (item) => {
            return item.position !== 'pending';
        });
        return filteredMembers;
    }

    public async findPendingMembers(id: string): Promise<any[]> {
        const team = await this.teamRepository.findOne({
            where: { id },
            relations: ['userTeams', 'userTeams.user']
        });

        const pendingMembers = _.filter(team.userTeams, (item) => {
            return item.position === 'pending';
        });
        return pendingMembers;
    }

    // POST METHODS
    public async create(data: TeamCreateDto): Promise<Team> {
        const { userId, name, description, photoUrl } = data;
        let newTeam = new Team();
        newTeam.name = name;
        newTeam.description = description;
        newTeam.photoUrl = photoUrl;
        newTeam = await this.teamRepository.save(newTeam);

        const user = await this.userRepository.findOne(userId);
        const userTeam = new UserTeam();
        userTeam.user = user;
        userTeam.team = newTeam;
        userTeam.position = 'headcoach';
        await this.userTeamRepository.save(userTeam);

        return newTeam;
    }

    // PUT METHODS
    // not used yet
    public async update(id: string, team: TeamCreateDto): Promise<Team> {
        const updatedTeam = Object.assign(await this.findOne(id), team);
        return await this.teamRepository.save(updatedTeam);
    }

    // DELETE METHODS
    public async delete(id: string): Promise<object> {
        await this.teamRepository.delete(id);
        const deleteMessage = {
            message: `Team with teamID=${id} deleted successfully!`
        };
        return deleteMessage;
    }
}
