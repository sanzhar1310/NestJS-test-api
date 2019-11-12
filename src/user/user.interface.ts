import { PostEntity } from 'src/entity/entity.posts';

export interface IUser {
  email: string;
  id: number;
  token?: string;
  posts?: PostEntity[];
}
