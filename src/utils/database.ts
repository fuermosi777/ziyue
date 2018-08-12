import PouchDB from 'pouchdb-react-native';
import { IAccountDoc } from '../interfaces/account';
import { IPostDoc } from '../interfaces/post';

const db = {
  account: new PouchDB<IAccountDoc>('ziyue'),
  post: new PouchDB<IPostDoc>('ziyue-post'),
};

export { db };
