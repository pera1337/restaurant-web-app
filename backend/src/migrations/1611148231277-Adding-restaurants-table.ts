import {MigrationInterface, QueryRunner} from "typeorm";

export class AddingRestaurantsTable1611148231277 implements MigrationInterface {
    name = 'AddingRestaurantsTable1611148231277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "restaurant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_649e250d8b8165cb406d99aa30f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "restaurant"`);
    }

}
