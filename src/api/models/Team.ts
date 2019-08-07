import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
// import { User } from '../types/User';
import { UserTeam } from './UserTeam';

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @OneToMany((type) => UserTeam, (userTeam) => userTeam.team)
    userTeams: UserTeam[];
}
