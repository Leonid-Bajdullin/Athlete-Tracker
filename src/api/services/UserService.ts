import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../../env';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { User } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import { UserCreateDto } from '../dto/user/UserCreateDto';
import { UserProfileChangesDto } from '../dto/user/UserProfileChangesDto';
import { LoginDto } from '../dto/user/LoginDto';
import { Account } from '../models/Account';
import { AccountRepository } from '../repositories/AccountRepository';
import { TeamIdPositionDto } from '../dto/team/TeamIdPositionDto';

@Service()
export class UserService {
    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private accountRepository: AccountRepository
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

    // GET METHODS
    // not used yet
    public findAll(): Promise<User[]> {
        return this.userRepository.find({
            relations: ['userTeams', 'userTeams.team', 'accounts']
        });
    }

    // not used yet
    public findOne(id: string): Promise<User | undefined> {
        return this.userRepository.findOne({
            where: { id: id },
            relations: ['userTeams', 'userTeams.team', 'accounts']
        });
    }

    public async getCurrentUser(token: string): Promise<User> {
        this.log.info('token ', token);
        if (!token) {
            return undefined;
        } else {
            const realToken = token.split(' ')[1];
            const data: any = jwt.verify(realToken, env.jwt.jwt_secret);
            this.log.info('data', data.id);
            const account = await this.accountRepository.findOne({
                where: { id: data.id },
                relations: ['user']
            });

            const user = account.user;
            return user;
        }
    }

    public async findUserTeams(id: string): Promise<Array<TeamIdPositionDto>> {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['userTeams']
        });

        if (user.userTeams.length < 1) {
            return [];
        } else {
            const userWithTeams = await this.userRepository.findOne({
                where: { id },
                relations: ['userTeams', 'userTeams.team']
            });
            return userWithTeams.userTeams.map((item) => {
                return new TeamIdPositionDto(item);
            });
        }
    }

    // POST METHODS
    public async create(user: UserCreateDto): Promise<User> {
        let newUser = new User();
        newUser.firstName = user.firstName;
        newUser.lastName = user.lastName;
        newUser.email = user.email;
        newUser = await this.userRepository.save(newUser);

        const account = new Account();
        account.salt = await this.hashPassword(user.password);
        account.user = newUser;
        account.provider = 'login';
        await this.accountRepository.save(account);

        return newUser;
    }

    public async login(loginData: LoginDto): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { email: loginData.email },
            relations: ['accounts']
        });

        const account = user.accounts.find((item) => item.provider === 'login');
        if (await bcrypt.compare(loginData.password, account.salt)) {
            const token = jwt.sign({ id: account.id }, env.jwt.jwt_secret);
            return {
                token,
                user
            };
        }

        return undefined;
    }

    // PUT METHODS
    public async update(id: string, user: any): Promise<UserProfileChangesDto> {
        const { password, ...rest } = user;
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
        return new UserProfileChangesDto(
            await this.userRepository.save(updatedUser)
        );
    }

    // DELETE METHODS
    public async delete(id: string): Promise<object> {
        await this.userRepository.delete(id);
        const deleteMessage = {
            message: `User with userID=${id} deleted successfully!`
        };
        return deleteMessage;
    }
}
