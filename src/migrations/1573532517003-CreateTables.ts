import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTables1573532517003 implements MigrationInterface {
    name = 'CreateTables1573532517003'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `posts` (`id` int NOT NULL AUTO_INCREMENT, `titleText` varchar(255) NOT NULL, `bodyText` text NOT NULL, `file` varchar(255) NULL, `downloadCount` int NOT NULL DEFAULT 0, `userId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `users` (`id` int NOT NULL AUTO_INCREMENT, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, `token` varchar(255) NULL, UNIQUE INDEX `IDX_97672ac88f789774dd47f7c8be` (`email`), UNIQUE INDEX `IDX_7869db61ed722d562da1acf6d5` (`token`), PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP INDEX `IDX_7869db61ed722d562da1acf6d5` ON `users`", undefined);
        await queryRunner.query("DROP INDEX `IDX_97672ac88f789774dd47f7c8be` ON `users`", undefined);
        await queryRunner.query("DROP TABLE `users`", undefined);
        await queryRunner.query("DROP TABLE `posts`", undefined);
    }

}
