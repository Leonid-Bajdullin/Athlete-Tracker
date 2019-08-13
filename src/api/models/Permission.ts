import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserTeam } from './UserTeam';

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column()
    public name: string;

    @OneToMany((type) => UserTeam, (userTeam) => userTeam.permission)
    public users: UserTeam[];
}
