import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    OneToMany
} from 'typeorm';
import { Account } from './Account';
import { UserTeam } from './UserTeam';

@Entity()
export class User {
    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    public static comparePassword(
        user: User,
        password: string
    ): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                resolve(res === true);
            });
        });
    }

    // Rows
    @PrimaryGeneratedColumn()
    public id: string;

    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'last_name' })
    public lastName: string;

    @Column()
    public nickname: string;

    @Column()
    public email: string;

    @IsNotEmpty()
    @Column()
    @Exclude()
    public password: string;

    @Column()
    public address: string;

    // Relations
    @OneToOne(() => Account, (account: Account) => account.user, {
        cascade: true
    })
    public account: Account;

    @OneToMany((type) => UserTeam, (userTeam) => userTeam.user)
    public userTeams: UserTeam[];
}
