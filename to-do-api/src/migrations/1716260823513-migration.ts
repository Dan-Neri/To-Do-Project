import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1716260823513 implements MigrationInterface {
    name = 'Migration1716260823513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feature" DROP CONSTRAINT "UQ_90a75650cb06d8daf98486808ec"`);
        await queryRunner.query(`ALTER TABLE "list" DROP CONSTRAINT "UQ_c583f8ac13fb35234edfd2d8134"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "list" ADD CONSTRAINT "UQ_c583f8ac13fb35234edfd2d8134" UNIQUE ("position", "projectID")`);
        await queryRunner.query(`ALTER TABLE "feature" ADD CONSTRAINT "UQ_90a75650cb06d8daf98486808ec" UNIQUE ("position", "listID")`);
    }

}
