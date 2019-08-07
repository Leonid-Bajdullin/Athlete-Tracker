import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
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
    public user: User;

    // private getAllAccounts = async (
    //     request: express.Request,
    //     response: express.Response
    // ) => {
    //     const accounts = await this.accountRepository.find({
    //         relations: ["user"]
    //     });
    //     response.send(accounts);
    // };
}
