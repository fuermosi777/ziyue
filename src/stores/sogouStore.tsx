import * as React from 'react';
import { observable, action } from 'mobx';
import { SogouWeb } from '../components/SogouWeb';
import { Task } from '../enums/sogouTask';
import { ISogouAccountListResult, ISogouAccountPostListResult } from '../interfaces/sogou';
import { IAccountDoc } from '../interfaces/account';
import { db } from '../utils/database';
import md5 from 'blueimp-md5';
import { postStore } from './postStore';
import { normalizeText } from '../utils/string';

class SogouStore {
  @observable
  public worker: JSX.Element | null = null;

  @observable
  public searchWorker: JSX.Element | null = null;

  @observable
  public status: string = '';

  @observable
  public searchStatus: string = '';

  @observable
  public isWorkerVisible: boolean = false;

  @observable
  public isSearchWorkerVisible: boolean = false;

  @action
  public searchAccounts = (query: string): Promise<ISogouAccountListResult> => {
    this.searchStatus = '搜索公众号...';
    return new Promise((resolve, reject) => {
      this.searchWorker = (
        <SogouWeb<ISogouAccountListResult>
          task={Task.GetAccountList}
          resource={query}
          onResult={(data) => {
            this.hideSearchWorker();
            resolve(data);
          }}
          onError={(err) => {
            this.hideSearchWorker();
            reject(err);
          }}
          onEnd={() => {
            this.hideSearchWorker();
            this.killSearchWorker();
          }}
          onVerify={() => {
            this.showSearchWorker();
          }}
          onPageChange={() => {
            this.hideSearchWorker();
          }}
        />
      );
    });
  };

  @action
  private searchAccountList = (query: string): Promise<ISogouAccountListResult> => {
    this.status = '搜索公众号...';
    return new Promise((resolve, reject) => {
      this.worker = (
        <SogouWeb<ISogouAccountListResult>
          task={Task.GetAccountList}
          resource={query}
          onResult={(data) => {
            this.hideWorker();
            resolve(data);
          }}
          onError={(err) => {
            this.hideWorker();
            reject(err);
          }}
          onEnd={() => {
            this.hideWorker();
            this.killWorker();
          }}
          onVerify={() => {
            this.showWorker();
          }}
          onPageChange={() => {
            this.hideWorker();
          }}
        />
      );
    });
  };

  @action
  private getPostList = (
    url: string,
    accountName: string
  ): Promise<ISogouAccountPostListResult> => {
    this.status = `获取公众号${accountName}的最新文章...`;
    return new Promise((resolve, reject) => {
      this.worker = (
        <SogouWeb<ISogouAccountPostListResult>
          task={Task.GetPostList}
          resource={url}
          onResult={(data) => {
            resolve(data);
          }}
          onError={(err) => {
            reject(err);
          }}
          onEnd={() => {
            this.killWorker();
          }}
          onVerify={() => {
            this.showWorker();
          }}
          onPageChange={() => {
            this.hideWorker();
          }}
        />
      );
    });
  };

  @action
  private getPostContent = (url: string, title: string): Promise<string> => {
    this.status = `下载${normalizeText(title)}...`;
    return new Promise((resolve, reject) => {
      this.worker = (
        <SogouWeb<string>
          task={Task.GetPostContent}
          resource={url}
          onResult={(data) => {
            resolve(data);
          }}
          onError={(err) => {
            reject(err);
          }}
          onEnd={() => {
            this.killWorker();
          }}
          onVerify={() => {
            this.showWorker();
          }}
          onPageChange={() => {
            this.hideWorker();
          }}
        />
      );
    });
  };

  @action
  public refreshPosts = async (accounts: IAccountDoc[]) => {
    // Do nothing if working.
    if (this.status !== '') return;

    for (let account of accounts) {
      try {
        let accountList = await this.searchAccountList(account.account);
        if (accountList.items.length === 0) {
          throw new Error('Cannot find targeting account.');
        }
        let accountLink = accountList.items[0].link;
        let postList = await this.getPostList(accountLink, account.name);
        if (postList.items.length === 0) {
          throw new Error(`Account ${account.name} found no posts.`);
        }
        for (let post of postList.items) {
          let id = md5(account.name + post.title + post.extra);
          // If already exist, then no need to open post page.
          try {
            await db.post.get(id);
            console.log('Post already exists.');
            continue;
          } catch (err) {}

          let postContent = await this.getPostContent(post.link, post.title);

          this.status = `解析${normalizeText(post.title)}...`;
          try {
            await postStore.addPost(post, account, postContent);
          } catch (err) {
            throw err;
          }
        }
      } catch (err) {
        console.log(`Add post of account ${account.name} halted. ${err.message}.`);
        continue;
      }
    }
    this.status = '';
  };

  @action
  public killWorker = () => {
    this.status = '';
    this.worker = null;
  };

  @action
  private killSearchWorker = () => {
    this.searchStatus = '';
    this.worker = null;
  };

  @action
  private showWorker = () => {
    this.isWorkerVisible = true;
  };

  @action
  private showSearchWorker = () => {
    this.isSearchWorkerVisible = true;
  };

  @action
  public hideWorker = () => {
    this.isWorkerVisible = false;
  };

  @action
  public hideSearchWorker = () => {
    this.isSearchWorkerVisible = false;
  };
}

const sogouStore = new SogouStore();

export { sogouStore };
