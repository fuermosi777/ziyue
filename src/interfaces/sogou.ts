import { IAccount } from './account';
import { IPostPreview, IPost } from './post';

export interface ISogouAccountListResult {
  items: Array<IAccount>;
  hasNext: boolean;
}

export interface ISogouAccountPostListResult {
  items: Array<IPostPreview>;
}

export interface ISogouPostListResult {
  items: Array<IPost>;
}
