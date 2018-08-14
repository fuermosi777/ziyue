import { observable, action } from 'mobx';
import { IPostDoc, IPostPreview } from '../interfaces/post';
import { db } from '../utils/database';
import RNFetchBlob from 'rn-fetch-blob';
import cheerio from 'cheerio-without-node-native';
import { IAccountDoc } from '../interfaces/account';
import md5 from 'blueimp-md5';

class PostStore {
  @observable
  public posts: IPostDoc[] = [];

  constructor() {
    this.refreshData();
  }

  @action
  public async addPost(post: IPostPreview, account: IAccountDoc, content: string) {
    let id = md5(account.name + post.title + post.extra);
    let formattedHtml = await this.formatPostContent(content);
    let relativePath = `/post/${id}.html`;
    await RNFetchBlob.fs.writeFile(
      `${RNFetchBlob.fs.dirs.DocumentDir}${relativePath}`,
      formattedHtml,
      'utf8'
    );
    try {
      await db.account.get(account.account);
    } catch (err) {
      throw new Error(`Account ${account.name} does not exist any more.`);
    }
    let postDoc: IPostDoc = {
      _id: id,
      title: post.title,
      createdAt: new Date(),
      extra: post.extra,
      isRead: false,
      isLike: false,
      account: account,
    };
    await db.post.put(postDoc);
    await this.refreshData();
  }

  @action
  public async readPost(post: IPostDoc) {
    post.isRead = true;
    await db.post.put(post);
    await this.refreshData();
  }

  @action
  public async deletePost(post: IPostDoc) {
    try {
      let postPath = `/post/${post._id}.html`;
      await db.post.remove(post._id!, post._rev!);
      await RNFetchBlob.fs.unlink(`${RNFetchBlob.fs.dirs.DocumentDir}${postPath}`);

      await this.refreshData();
    } catch (err) {
      console.log(`Failed to delete post. ${err.message}`);
    }
  }

  @action
  public async deleteAllPosts() {
    try {
      let result = await db.post.allDocs();
      for (let row of result.rows) {
        if (row.doc) {
          let post = row.doc;
          let postPath = `/post/${post._id}.html`;
          await db.post.remove(post);
          await RNFetchBlob.fs.unlink(`${RNFetchBlob.fs.dirs.DocumentDir}${postPath}`);
        }
      }
      await this.refreshData();
    } catch (err) {
      console.log(`Failed to delete all posts, ${err.message}`);
    }
  }

  @action
  private refreshData = async () => {
    try {
      const result = await db.post.allDocs<IPostDoc>();
      const posts = [];
      for (let row of result.rows) {
        if (row.doc) {
          const post = row.doc;
          if (!post.isRead) {
            posts.push(post);
          }
        }
      }
      this.posts = posts;
    } catch (err) {
      throw err;
    }
  };

  private formatPostContent = async (html: string) => {
    const $ = (cheerio as CheerioAPI).load(html);
    const httpImages = $('img')
      .filter((_i, elem) => Boolean($(elem).attr('data-src')))
      .toArray();
    if (httpImages.length === 0) {
      return html;
    }
    for (let img of httpImages) {
      let realSrc = $(img).attr('data-src');
      if (realSrc) {
        let res = await RNFetchBlob.fetch('GET', realSrc);
        let status = res.info().status;
        if (status === 200) {
          let base64Str = res.base64();
          $(img).attr('src', `data:image/png;base64,${base64Str}`);
        }
      }
    }
    return $.html();
  };
}

const postStore = new PostStore();

export { postStore };
