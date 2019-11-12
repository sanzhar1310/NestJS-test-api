import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  UseGuards,
  Body,
  Headers,
  Res,
  HttpCode,
  Delete,
  Query,
} from '@nestjs/common';
import { PostEntity } from 'src/entity/entity.posts';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express-serve-static-core';
import { QueryFields } from '@nestjsx/crud-request';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('/q?')
  getPosts(@Query() query: any): Promise<PostEntity[]> {
    const {
      orderBy = 'id',
      orderDir = 'ASC',
      page = 1,
      perPage = 5,
      search = '',
    } = query;

    return this.postService
      .find({
        order: { [orderBy]: orderDir },
        where: search,
        take: perPage,
        skip: (page - 1) * perPage,
      })
      .then((posts: PostEntity[]) => {
        if (posts.length < 1) {
          throw new NotFoundException();
        } else {
          return posts;
        }
      });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  getPostById(@Param() params: { id: number }): Promise<PostEntity> {
    return this.postService.findOne(params.id).then(post => {
      if (!post) {
        throw new NotFoundException();
      } else {
        return post;
      }
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(201)
  createPost(
    @Body() newPost: PostEntity,
    @Headers() header,
    @Res() response: Response,
  ): Promise<Response> {
    const token: string = (
      header.authorization || header.Authorization
    ).replace('Bearer ', '');
    return this.postService
      .createPost(token, newPost)
      .then(() => response.send());
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id')
  @HttpCode(204)
  updatePost(
    @Body() post: PostEntity,
    @Res() response: Response,
    @Param() params: { id: number },
  ): Promise<Response> {
    return this.postService
      .updatePost(params.id, post)
      .then(() => response.send());
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  @HttpCode(204)
  deletePost(
    @Res() response: Response,
    @Param() params: { id: number },
  ): Promise<Response> {
    return this.postService.deletePost(params.id).then(() => response.send());
  }
}
