import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialSchema1704451932729 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "username" VARCHAR(100) NOT NULL UNIQUE,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "role" VARCHAR(20) NOT NULL DEFAULT 'user',
        "is_active" BOOLEAN NOT NULL DEFAULT true
      );
      CREATE INDEX "idx_username" ON "users"("username");
      CREATE INDEX "idx_email" ON "users"("email");
    `);

    // Create states table
    await queryRunner.query(`
      CREATE TABLE "states" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL UNIQUE
      );
    `);

    // Create cities table
    await queryRunner.query(`
      CREATE TABLE "cities" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "state_id" INTEGER NOT NULL,
        CONSTRAINT "fk_state" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE
      );
    `);

    // Create colleges table
    await queryRunner.query(`
      CREATE TABLE "colleges" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "score" INTEGER NOT NULL CHECK (score >= 1 AND score <= 1000),
        "city_id" INTEGER NOT NULL,
        "state_id" INTEGER NOT NULL,
        CONSTRAINT "fk_city" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_state_college" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE CASCADE
      );
      CREATE INDEX "idx_college_location" ON "colleges"("city_id", "state_id");
      CREATE INDEX "idx_college_score" ON "colleges"("score" DESC);
    `);

    // Create college_placement table
    await queryRunner.query(`
      CREATE TABLE "college_placement" (
        "id" SERIAL PRIMARY KEY,
        "college_id" INTEGER NOT NULL,
        "year" INTEGER NOT NULL,
        "highest_placement" DECIMAL(10,2),
        "average_placement" DECIMAL(10,2),
        "median_placement" DECIMAL(10,2),
        "placement_rate" DECIMAL(5,2),
        CONSTRAINT "fk_college_placement" FOREIGN KEY ("college_id") REFERENCES "colleges"("id") ON DELETE CASCADE
      );
      CREATE INDEX "idx_placement_year" ON "college_placement"("college_id", "year");
    `);

    // Create college_wise_course table
    await queryRunner.query(`
      CREATE TABLE "college_wise_course" (
        "id" SERIAL PRIMARY KEY,
        "college_id" INTEGER NOT NULL,
        "course_name" VARCHAR(255) NOT NULL,
        "course_duration" DECIMAL(3,1) NOT NULL,
        "course_fee" DECIMAL(10,2) NOT NULL,
        CONSTRAINT "fk_college_course" FOREIGN KEY ("college_id") REFERENCES "colleges"("id") ON DELETE CASCADE
      );
      CREATE INDEX "idx_course_fee" ON "college_wise_course"("course_fee" DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "college_wise_course" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "college_placement" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "colleges" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cities" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "states" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users" CASCADE;`);
  }
}