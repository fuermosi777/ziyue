export interface IAccount {
  name: string;
  link: string;
  imgUrl: string;
  account: string;
  description: string;
}

export interface IAccountDoc {
  _id?: string;
  _rev?: string;
  name: string;
  imgPath: string;
  account: string;
  description: string;
}
