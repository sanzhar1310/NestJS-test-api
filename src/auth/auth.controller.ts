import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  ValidationPipe,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/entity/entity.users';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { Response } from 'express-serve-static-core';
import { IUser } from 'src/user/user.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  ping(@Headers() reqHeader): Promise<IUser> {
    const token: string = (
      reqHeader.authorization || reqHeader.Authorization
    ).replace('Bearer ', '');
    return this.authService.ping(token);
  }

  @Post('signin')
  signIn(
    @Body(new ValidationPipe({ validateCustomDecorators: true }))
    user: UserEntity,
  ): Promise<IUser> {
    return this.authService.signIn(user);
  }

  @Post('signup')
  signUp(
    @Body(new ValidationPipe({ validateCustomDecorators: true }))
    user: UserEntity,
  ): Promise<IUser> {
    return this.userService
      .register(user)
      .then(() => this.authService.signIn(user));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  @HttpCode(204)
  logout(@Headers() reqHeader): Promise<void> {
    const token: string = (
      reqHeader.authorization || reqHeader.Authorization
    ).replace('Bearer ', '');
    return this.logout(token);
  }
}
