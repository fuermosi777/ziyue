import { observable, action } from 'mobx';
import { IAccount, IAccountDoc } from '../interfaces/account';
import { db } from '../utils/database';
import RNFetchBlob from 'rn-fetch-blob';
import { IPostDoc } from '../interfaces/post';
import { postStore } from './postStore';

class AccountStore {
  @observable
  accounts: IAccountDoc[] = [];

  constructor() {
    this.refreshData();
  }

  @action
  public async addAccount(account: IAccount) {
    try {
      await db.account.get(account.account);
      console.log('Account already exists.');
      return;
    } catch (err) {}
    try {
      // Store account avatar image to local.
      let relativePath = `/account/${account.account}.png`;
      await RNFetchBlob.config({
        path: `${RNFetchBlob.fs.dirs.DocumentDir}${relativePath}`,
      }).fetch('GET', account.imgUrl, {});

      const accountDoc: IAccountDoc = {
        _id: account.account,
        name: account.name,
        imgPath: relativePath,
        account: account.account,
        description: account.description,
      };

      await db.account.put(accountDoc);

      await this.refreshData();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  @action
  public async removeAccount(account: IAccountDoc) {
    try {
      await RNFetchBlob.fs.unlink(`${RNFetchBlob.fs.dirs.DocumentDir}${account.imgPath}`);
      await db.account.remove(account._id!, account._rev!);
      try {
        let result = await db.post.allDocs();
        for (let row of result.rows) {
          if (row.doc) {
            let post = row.doc;
            if (post.account._id === account._id) {
              await postStore.deletePost(post);
            }
          }
        }
      } catch (err) {
        console.log(`Does not find posts associated with account ${account.name}, ${err.message}`);
      }

      await this.refreshData();
    } catch (err) {
      console.log('Remove account failed.' + err.message);
      throw err;
    }
  }

  @action
  private refreshData = async () => {
    try {
      const result = await db.account.allDocs<IAccountDoc>();
      const accounts = [];
      for (let row of result.rows) {
        if (row.doc) {
          accounts.push(row.doc);
        }
      }
      this.accounts = accounts;
    } catch (err) {
      throw err;
    }
  };
}

const accountStore = new AccountStore();

export { accountStore };
