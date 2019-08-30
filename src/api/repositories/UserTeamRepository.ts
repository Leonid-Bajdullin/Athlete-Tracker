import { EntityRepository, Repository } from 'typeorm';

import { UserTeam } from '../models/UserTeam';

@EntityRepository(UserTeam)
export class UserTeamRepository extends Repository<UserTeam> {}
