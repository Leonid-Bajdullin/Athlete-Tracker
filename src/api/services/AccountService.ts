import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Account } from '../models/Account';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { AccountRepository } from '../repositories/AccountRepository';

@Service()
export class AccountService {
    constructor(
        @OrmRepository() private accountRepository: AccountRepository,
        @Logger(__filename) private log: LoggerInterface
    ) {}

    public find(): Promise<Account[]> {
        this.log.info('Find all accounts');
        return this.accountRepository.find({ relations: ['user'] });
    }

    public findOne(id: string): Promise<Account | undefined> {
        this.log.info('Find one account');
        return this.accountRepository.findOne({
            where: { id: id },
            relations: ['user']
        });
    }
}
