import { IAccount } from './account';

export interface ISogouSearchAccountResult {
  items: Array<IAccount>;
  hasNext: boolean;
}
