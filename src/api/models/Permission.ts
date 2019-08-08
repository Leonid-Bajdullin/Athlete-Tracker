import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserTeam } from './UserTeam';

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column()
    public type: string;

    @OneToMany((type) => UserTeam, (userTeam) => userTeam.permission)
    public user: UserTeam;
}
