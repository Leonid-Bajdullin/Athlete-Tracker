import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    ManyToMany,
    JoinTable
} from 'typeorm';
import { Account } from './Account';
import { Role } from './Role';
import { Permission } from './Permission';

// import { Pet } from './Pet';

@Entity()
export class User {
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

    @OneToOne(() => Account, (account: Account) => account.user, {
        cascade: true,
        eager: true
    })
    @JoinColumn()
    public account: Account;

    @ManyToMany(() => Role)
    @JoinTable()
    public roles: Role[];

    @ManyToMany(() => Permission)
    @JoinTable()
    public permissions: Permission[];

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
}

// public static hashPassword(password: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//         bcrypt.hash(password, 10, (err, hash) => {
//             if (err) {
//                 return reject(err);
//             }
// 						resolve(hash);
//         });
//     });
// }

// public static comparePassword(user: User, password: string): Promise<boolean> {
//     return new Promise((resolve, reject) => {
//         bcrypt.compare(password, user.password, (err, res) => {
//             resolve(res === true);
//         });
//     });
// }

// @PrimaryColumn('uuid')
// public id: string;

// @IsNotEmpty()
// @Column({ name: 'first_name' })
// public firstName: string;

// @IsNotEmpty()
// @Column({ name: 'last_name' })
// public lastName: string;

// @IsNotEmpty()
// @Column()
// public email: string;

// @IsNotEmpty()
// @Column()
// @Exclude()
// public password: string;

// @IsNotEmpty()
// @Column()
// public username: string;

// @OneToMany(type => Pet, pet => pet.user)
// public pets: Pet[];

// public toString(): string {
//     return `${this.firstName} ${this.lastName} (${this.email})`;
// }

// @BeforeInsert()
// public async hashPassword(): Promise<void> {
//     this.password = await User.hashPassword(this.password);
// }
