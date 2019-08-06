import { IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Pet {
    @PrimaryColumn("uuid")
    public id: string;

    @IsNotEmpty()
    @Column()
    public name: string;

    @IsNotEmpty()
    @Column()
    public age: number;

    @Column({
        name: "user_id",
        nullable: true
    })
    public userId: string;

    public toString(): string {
        return `${this.name}`;
    }
}
