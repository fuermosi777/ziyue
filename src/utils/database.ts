import PouchDB from 'pouchdb-react-native';
import { IAccountDoc } from '../interfaces/account';

const db = {
  account: new PouchDB<IAccountDoc>('ziyue'),
};

export { db };
