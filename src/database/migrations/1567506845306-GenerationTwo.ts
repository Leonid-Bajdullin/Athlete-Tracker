import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerationTwo1567506845306 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "description" SET NOT NULL`);
    }

}
