import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// import { User } from '../types/User';
import { User } from './User';
import { Team } from './Team';

@Entity()
export class UserTeam {
    @PrimaryGeneratedColumn()
    public userId: string;

    @PrimaryGeneratedColumn()
    public teamId: string;

    @Column()
    public role: string;

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
}
