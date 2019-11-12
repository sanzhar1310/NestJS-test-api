import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from 'src/entity/entity.posts';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/entity/entity.users';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [PostsController],
  providers: [PostsService, UserService],
})
export class PostsModule {}
