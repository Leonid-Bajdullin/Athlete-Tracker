import {MigrationInterface, QueryRunner} from "typeorm";

export class GenerationOne1566909310029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "team" ADD "description" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "team" DROP COLUMN "description"`);
    }

}
