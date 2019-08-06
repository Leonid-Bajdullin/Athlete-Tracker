import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    public permission: string;
}
