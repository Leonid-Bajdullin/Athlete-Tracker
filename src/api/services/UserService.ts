import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import passport from 'passport';
// import uuid from 'uuid';

import { env } from '../../env';
import {
    EventDispatcher,
    EventDispatcherInterface
} from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { AccountRepository } from '../repositories/AccountRepository';
import { events } from '../subscribers/events';
import { UserRequestDto } from '../dto/UserRequestDto';
import { Account } from '../models/Account';
import { LoginDto } from '../dto/LoginDto';

@Service()
export class UserService {
    constructor(
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private accountRepository: AccountRepository,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
        @Logger(__filename) private log: LoggerInterface
    ) {}

    public hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    public comparePassword(
        account: Account,
        password: string
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, account.salt, (err, res) => {
                resolve(res === true);
            });
        });
    }

    public findAll(): Promise<User[]> {
        this.log.info('Find all users');
        return this.userRepository.find({
            relations: ['userTeams', 'accounts']
        });
    }

    public findOne(id: string): Promise<User | undefined> {
        this.log.info('Find one user');
        return this.userRepository.findOne({
            where: { id: id },
            relations: ['userTeams', 'accounts']
        });
    }

    public async create(user: UserRequestDto): Promise<User> {
        const newUser = await this.userRepository.save(user);
        const returnedUser = await this.findOne(newUser.id);

        this.eventDispatcher.dispatch(events.user.created, returnedUser);

        const account = new Account();
        account.salt = await this.hashPassword(user.password);
        account.user = returnedUser;
        account.provider = 'login';
        await this.accountRepository.save(account);
        return returnedUser;
    }

    public async update(id: string, user: UserRequestDto): Promise<User> {
        this.log.info('Update a user');
        const updatedUser = Object.assign(await this.findOne(id), user);
        console.log(updatedUser);
        return updatedUser;
    }

    public async delete(id: string): Promise<{}> {
        this.log.info('Delete a user');
        await this.userRepository.delete(id);
        const deleteMessage = {
            message: `User with userID=${id} deleted successfully!`
        };
        return deleteMessage;
    }

    public async login(loginData: LoginDto): Promise<{}> {
        const user = await this.userRepository.findOne({
            where: { email: loginData.email },
            relations: ['accounts']
        });
        const account = user.accounts.find((item) => item.provider === 'login');
        this.log.info('account =>', account);
        this.log.info(
            'is compared password correct? => ',
            this.comparePassword(account, loginData.password) //returns empty object, why?
        );
        if (this.comparePassword(account, loginData.password)) {
            const token = jwt.sign({ id: account.id }, env.jwt.jwt_secret);
            return {
                token: token
            };
        }
        return { message: 'Password incorrect' };
    }
}
