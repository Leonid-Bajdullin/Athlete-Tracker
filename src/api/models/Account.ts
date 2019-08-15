import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column()
    public provider: string;

    @Column()
    public salt: string;

    @ManyToOne(() => User, (user: User) => user.accounts, {
        onDelete: 'CASCADE'
    })
    public user: User;
}
