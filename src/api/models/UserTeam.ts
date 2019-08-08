import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
// import { User } from '../types/User';
import { User } from './User';
import { Team } from './Team';
import { Role } from './Role';
import { Permission } from './Permission';

@Entity()
export class UserTeam {
    @PrimaryGeneratedColumn()
    public userId: string;

    @PrimaryGeneratedColumn()
    public teamId: string;

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

    @ManyToOne((type) => Role, (role) => role.user)
    public role: Role;

    @ManyToOne((type) => Permission, (permission) => permission.user)
    public permission: Permission;
}
