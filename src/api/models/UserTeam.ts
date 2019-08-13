import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
// import { User } from '../types/User';
import { User } from './User';
import { Team } from './Team';
import { Permission } from './Permission';

@Entity()
export class UserTeam {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    public userId: string;

    @PrimaryGeneratedColumn({ name: 'team_id' })
    public teamId: string;

    @Column()
    public position: string;

    // Relations
    @ManyToOne((type) => User, (user) => user.userTeams, {
        primary: true,
        onDelete: 'CASCADE'
    })
    public user: User;

    @ManyToOne((type) => Team, (team) => team.userTeams, {
        primary: true,
        onDelete: 'CASCADE'
    })
    public team: Team;

    @ManyToOne((type) => Permission, (permission) => permission.users)
    public permission: Permission;
}
