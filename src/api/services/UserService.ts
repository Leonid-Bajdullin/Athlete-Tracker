import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../../env';
import {
    EventDispatcher,
    EventDispatcherInterface
} from '../../decorators/EventDispatcher';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { UserCreateDto } from '../dto/user/UserCreateDto';
import { UserSubmitChangesDto } from '../dto/user/UserSubmitChangesDto';
import { LoginDto } from '../dto/user/LoginDto';
import { Account } from '../models/Account';
import { AccountRepository } from '../repositories/AccountRepository';
import { events } from '../subscribers/events';

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

    public findAll(): Promise<User[]> {
        this.log.info('Find all users');
        return this.userRepository.find({
            relations: ['userTeams', 'userTeams.team', 'accounts']
        });
    }

    public findOne(id: string): Promise<User | undefined> {
        this.log.info('Find one user');
        return this.userRepository.findOne({
            where: { id: id },
            relations: ['userTeams', 'userTeams.team', 'accounts']
        });
    }

    public async findUserTeams(id: string): Promise<Array<any>> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['userTeams', 'userTeams.team']
        });
        this.log.info('', user.userTeams);
        if (user.userTeams === []) {
            return [];
        }
        return user.userTeams.map((item) => {
            return {
                id: item.team.id,
                position: item.position
            };
        });
    }

    public async create(user: UserCreateDto): Promise<User> {
        let newUser = new User();
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.email = user.email;
        newUser.nickname = '';

        newUser = await this.userRepository.save(newUser);
        const returnedUser = await this.findOne(newUser.id);

        this.eventDispatcher.dispatch(events.user.created, returnedUser);

        const account = new Account();
        account.salt = await this.hashPassword(user.password);
        account.user = returnedUser;
        account.provider = 'login';
        await this.accountRepository.save(account);
        return returnedUser;
    }

    public async update(id: string, user: UserSubmitChangesDto): Promise<User> {
        this.log.info('Update a user');
        let { password, ...rest } = user;
        const updatedUser = Object.assign(
            await this.userRepository.findOne(id),
            rest
        );
        if (user.password) {
            const newPassword = await this.hashPassword(user.password);
            const account = (await this.findOne(id)).accounts.find((item) => {
                return item.provider === 'login';
            });
            account.salt = newPassword;
            this.accountRepository.save(account);
        }
        return await this.userRepository.save(updatedUser);
    }

    public async delete(id: string): Promise<{}> {
        this.log.info('Delete a user');
        await this.userRepository.delete(id);
        const deleteMessage = {
            message: `User with userID=${id} deleted successfully!`
        };
        return deleteMessage;
    }

    public async login(loginData: LoginDto): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { email: loginData.email },
            relations: ['accounts']
        });
        const account = user.accounts.find((item) => item.provider === 'login');
        this.log.info('user =>', user);

        const isEqual = await bcrypt.compare(loginData.password, account.salt);
        this.log.info('compare result => ', isEqual);
        if (isEqual) {
            const token = jwt.sign({ id: account.id }, env.jwt.jwt_secret);
            return {
                token: token,
                user: user
            };
        }

        return undefined;
    }
}
