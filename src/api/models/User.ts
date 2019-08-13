import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany
} from 'typeorm';
import { Account } from './Account';
import { UserTeam } from './UserTeam';
import { Role } from './Role';

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

    @Column('jsonb')
    public data: JSON;

    @Column()
    public phone: string;

    @Column({ name: 'photo_url' })
    public photoUrl: string;

    // Relations
    @OneToMany((type) => Account, (account) => account.user)
    public accounts: Account[];

    @OneToMany((type) => UserTeam, (userTeam) => userTeam.user)
    public userTeams: UserTeam[];

    @ManyToOne((type) => Role, (role) => role.users)
    public role: Role;
}
