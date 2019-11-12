import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PostEntity } from 'src/entity/entity.posts';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { UserEntity } from 'src/entity/entity.users';
import { Override } from '@nestjsx/crud';

@Injectable()
export class PostsService extends TypeOrmCrudService<PostEntity> {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    private userService: UserService,
  ) {
    super(postRepository);
  }

  public createPost(token: string, post: PostEntity): Promise<PostEntity> {
    return this.userService
      .findOne({ where: { token } })
      .then((user: UserEntity) => {
        if (!user) {
          throw new UnauthorizedException();
        }
        const postToSave = new PostEntity();
        postToSave.bodyText = post.bodyText;
        postToSave.titleText = post.titleText;
        postToSave.file = post.file;
        postToSave.downloadCount = 0;
        postToSave.userId = user.id;
        return this.postRepository.save(postToSave);
      });
  }

  public updatePost(postId: number, newPost: PostEntity): Promise<void> {
    return this.findOne(postId)
      .then(post => {
        if (!post) {
          throw new NotFoundException();
        }
        return this.postRepository.update(postId, newPost);
      })
      .then(() => undefined);
  }

  public deletePost(postId: number): Promise<void> {
    return this.findOne(postId)
      .then(post => {
        if (!post) {
          throw new NotFoundException();
        }
        return this.postRepository.delete(postId);
      })
      .then(() => undefined);
  }
}
