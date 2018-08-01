import { observable, action } from 'mobx';
import { NativeSyntheticEvent, WebViewMessageEventData, WebView } from 'react-native';
import { IAccount } from '../interfaces/account';
import { ISogouSearchAccountResult } from '../interfaces/sogou';
import { db } from '../utils/database';

enum State {
  Idle,
  Search,
}

class SogouStore {
  @observable uri: string | null = null;
  @observable state: State = State.Idle;
  @observable isLoading: boolean = false;
  @observable isError: boolean = false;
  @observable accountList: Array<IAccount> = [];
  @observable accountListHasNext: boolean = false;

  @action
  public searchInSogou = (query: string) => {
    this.state = State.Search;
    this.uri = this.buildSearchUrl(query);
  };

  @action
  public handleLoadStart = () => {
    console.log('load start');
    this.isLoading = true;
    this.isError = false;
  };

  @action
  public handleLoad = (webview: WebView | null) => {
    console.log('load');
    if (!webview) return;
    if (this.state === State.Search) {
      webview.postMessage('@Search');
    }
  };

  @action
  public handleError = () => {
    console.log('load error');
    this.isError = true;
  };

  @action
  public handleLoadEnd = () => {
    console.log('load end');
    this.isLoading = false;
  };

  @action
  public handleMessage = (event: NativeSyntheticEvent<WebViewMessageEventData>) => {
    this.handleLoadEnd();
    if (this.state === State.Search) {
      const result = JSON.parse(event.nativeEvent.data) as ISogouSearchAccountResult;
      this.accountList = result.items;
      this.accountListHasNext = result.hasNext;
    }
  };

  private buildSearchUrl = (query: string, page = 1) => {
    return `https://weixin.sogou.com/weixin?query=${encodeURIComponent(
      query
    )}&_sug_type_=&s_from=input&_sug_=y&type=1&page=${page}&ie=utf8`;
  };
}

const sogouStore = new SogouStore();

export { sogouStore };
