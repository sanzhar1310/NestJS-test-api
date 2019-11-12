import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

import { JwtStrategy } from './jwt.strategy';

import { UserEntity } from 'src/entity/entity.users';
import { PostEntity } from 'src/entity/entity.posts';
import { PostsService } from 'src/posts/posts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([PostEntity]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PostsService,
    JwtStrategy,
    PassportModule,
  ],
})
export class AuthModule {}
