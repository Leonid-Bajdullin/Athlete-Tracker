import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity()
export class Account {
    @PrimaryGeneratedColumn({ name: 'user_id' })
    public userId: string;

    @Column()
    public google: string;

    @Column()
    public facebook: string;

    @OneToOne(() => User, (user: User) => user.account)
    @JoinColumn()
    public user: User;
}
