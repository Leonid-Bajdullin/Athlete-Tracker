import { EventSubscriber, On } from 'event-dispatch';

import { Logger } from '../../lib/logger';
import { Team } from '../models/Team';
import { events } from './events';

const log = new Logger(__filename);

@EventSubscriber()
export class TeamEventSubscriber {
    @On(events.team.created)
    public onTeamCreate(team: Team): void {
        log.info('Team ' + team.toString() + ' created!');
    }
}
