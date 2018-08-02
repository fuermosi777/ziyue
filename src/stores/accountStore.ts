import { observable, action } from 'mobx';
import { IAccount, IAccountDoc } from '../interfaces/account';
import { db } from '../utils/database';
import RNFetchBlob from 'rn-fetch-blob';

class AccountStore {
  @observable accounts: IAccountDoc[] = [];

  constructor() {
    this.refreshData();
  }

  @action
  public async followAccount(account: IAccount) {
    try {
      const imageResponse = await RNFetchBlob.config({
        session: 'ziyue',
        fileCache: true,
      }).fetch('GET', account.imgUrl, {});

      const accountDoc: IAccountDoc = {
        name: account.name,
        imgPath: imageResponse.path(),
        account: account.account,
        description: account.description,
      };

      await db.account.post(accountDoc);

      await this.refreshData();
    } catch (err) {
      console.log(err);
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
