import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar', length: 255, nullable: false })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @IsNotEmpty()
  @MinLength(4)
  password: string;

  @Column({ unique: true, nullable: true })
  token: string;
}
