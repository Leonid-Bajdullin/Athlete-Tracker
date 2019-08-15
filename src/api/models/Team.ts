import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { User } from '../types/User';
import { UserTeam } from './UserTeam';

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column()
    public name: string;

    @OneToMany((type) => UserTeam, (userTeam) => userTeam.team)
    public userTeams: UserTeam[];
}
