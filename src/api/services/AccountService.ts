import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Account } from '../models/Account';
// import { Logger, LoggerInterface } from '../../decorators/Logger';
import { AccountRepository } from '../repositories/AccountRepository';

@Service()
export class AccountService {
    constructor(
        // @Logger(__filename) private log: LoggerInterface
        @OrmRepository() private accountRepository: AccountRepository
    ) {}

    public find(): Promise<Account[]> {
        return this.accountRepository.find({ relations: ['user'] });
    }

    public findOne(id: string): Promise<Account | undefined> {
        return this.accountRepository.findOne({
            where: { id: id },
            relations: ['user']
        });
    }
}
