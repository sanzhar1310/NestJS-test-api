import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, IsInt } from 'class-validator';

@Entity({ name: 'posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @IsNotEmpty()
  titleText: string;

  @IsNotEmpty()
  @Column({ type: 'text' })
  bodyText: string;

  @Column({ type: 'varchar', nullable: true })
  file: string;

  @Column({ type: 'int', default: 0 })
  @IsInt()
  downloadCount: number;

  @Column({ type: 'int', nullable: false })
  userId: number;
}
