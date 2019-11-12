import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/entity.users';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as bcrypt from 'bcryptjs';
import { IUser } from './user.interface';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  public register(user: UserEntity): Promise<IUser> {
    return this.findOne({ where: { email: user.email } })
      .then((foundUser: UserEntity) => {
        if (foundUser) {
          throw new ConflictException();
        }
      })
      .then(() =>
        bcrypt
          .hash(user.password, 10)
          .then((hash: string) => {
            const newUser = new UserEntity();
            newUser.email = user.email;
            newUser.password = hash;
            newUser.token = user.token;
            return this.saveUser(newUser);
          })
          .then(({ password, ...rest }: UserEntity) => rest),
      );
  }

  public saveUser(user: UserEntity): Promise<IUser> {
    return this.userRepository.save(user).then(({ email, id, token }) => ({
      email,
      id,
      token,
    }));
  }

  public deleteToken(token: string): Promise<void> {
    return this.findOne({ where: { token } })
      .then((user: UserEntity) =>
        this.userRepository.update(user.id, { ...user, token: null }),
      )
      .then(() => undefined);
  }
}
