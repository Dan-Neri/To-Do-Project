import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1716260620309 implements MigrationInterface {
    name = 'Migration1716260620309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list" DROP CONSTRAINT "UQ_c583f8ac13fb35234edfd2d8134"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list" ADD CONSTRAINT "UQ_c583f8ac13fb35234edfd2d8134" UNIQUE ("position", "projectID")`);
    }

}
