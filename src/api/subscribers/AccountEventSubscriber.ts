import { EventSubscriber, On } from 'event-dispatch';

import { Logger } from '../../lib/logger';
import { Account } from '../models/Account';
import { events } from './events';

const log = new Logger(__filename);

@EventSubscriber()
export class AccountEventSubscriber {
    @On(events.account.created)
    public onAccountCreate(account: Account): void {
        log.info('Account ' + account.toString() + ' created!');
    }
}
