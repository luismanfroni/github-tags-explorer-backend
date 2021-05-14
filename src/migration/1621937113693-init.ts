import { MigrationInterface, QueryRunner } from "typeorm";

export class init1621937113693 implements MigrationInterface {
  name = "init1621937113693";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tag" ("repoName" character varying(255) NOT NULL, "repoAuthor" character varying(255) NOT NULL, "createdBy" character varying(255) NOT NULL, "tagName" character varying(255) NOT NULL, CONSTRAINT "PK_c24dedc5832dee9a5e366a5ab92" PRIMARY KEY ("repoName", "repoAuthor", "createdBy", "tagName"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tag"`);
  }
}
