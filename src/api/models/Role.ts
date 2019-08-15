import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './User';

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column()
    public name: string;

    @OneToMany((type) => User, (user) => user.role)
    public users: User[];
}
