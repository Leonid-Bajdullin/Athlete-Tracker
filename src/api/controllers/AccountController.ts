import {
    Get,
    JsonController,
    OnUndefined,
    Param,
    UseBefore
} from 'routing-controllers';

import { AccountNotFoundError } from '../errors/AccountNotFoundError';
import { Account } from '../models/Account';
import { AccountService } from '../services/AccountService';
import { CheckAuthMiddleware } from '../middlewares/CheckAuthMiddlware';

@JsonController('/accounts')
export class AccountController {
    constructor(private accountService: AccountService) {}

    @UseBefore(CheckAuthMiddleware)
    @Get()
    public find(): Promise<Account[]> {
        return this.accountService.find();
    }

    @UseBefore(CheckAuthMiddleware)
    @OnUndefined(AccountNotFoundError)
    @Get('/:id')
    public findOne(@Param('id') id: string): Promise<Account | undefined> {
        return this.accountService.findOne(id);
    }
}
