import { IAccountDoc } from './account';

export interface IPostPreview {
  title: string;
  link: string;
  extra: string;
  preview: string;
}

export interface IPost {
  title: string;
  date: string;
  html: string;
}

export interface IPostDoc {
  _id?: string;
  _rev?: string;
  title: string;
  createdAt: Date;
  extra: string;
  isRead: boolean;
  isLike: boolean;
  account: IAccountDoc;
}
