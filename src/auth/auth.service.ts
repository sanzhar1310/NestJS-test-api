import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/entity/entity.users';
import * as bcrypt from 'bcryptjs';
import { PostEntity } from 'src/entity/entity.posts';
import { IUser } from 'src/user/user.interface';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly postService: PostsService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private validateUser(email: string, password: string): Promise<UserEntity> {
    return this.userService
      .findOne({ where: { email } })
      .then((user: UserEntity) => {
        if (!user) {
          throw new NotFoundException();
        }
        return bcrypt
          .compare(password, user.password)
          .then((result: boolean) => {
            if (result) {
              return user;
            } else {
              throw new ForbiddenException();
            }
          });
      });
  }

  public signIn(user: UserEntity): Promise<IUser> {
    return this.validateUser(user.email, user.password).then(
      (existsUser: UserEntity) => {
        if (existsUser.token) {
          this.jwtService.decode(existsUser.token);
        }
        const payload = `${user.email}${user.id}${new Date().getTime()}`;
        const tokenHash = this.jwtService.sign(payload);
        existsUser.token = tokenHash;
        return this.userService
          .saveUser(existsUser)
          .then(savedUser => this.ping(savedUser.token));
      },
    );
  }

  public signUp(user: UserEntity): Promise<IUser> {
    return this.userService
      .register(user)
      .then(savedUser => this.ping(savedUser.token));
  }

  public ping(token: string): Promise<IUser> {
    return this.userService.findOne({ where: { token } }).then(user => {
      if (!user) {
        throw new NotFoundException();
      }
      return this.postService
        .find({ where: { userId: user.id } })
        .then((posts: PostEntity[]) => ({
          email: user.email,
          id: user.id,
          token: user.token,
          posts,
        }));
    });
  }

  public logout(token: string): Promise<void> {
    this.jwtService.decode(token);
    return this.userService.deleteToken(token);
  }
}
