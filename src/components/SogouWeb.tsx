import * as React from 'react';
import {
  View,
  WebView,
  StyleSheet,
  NativeSyntheticEvent,
  WebViewMessageEventData,
} from 'react-native';
import { injectedJavaScript } from '../utils/inject';
import { Task } from '../enums/sogouTask';

export interface Props<R> {
  task: Task;
  resource: string;
  onResult(data: R): void;
  onError(err: Error): void;
  onVerify(): void;
  onEnd(): void;
  onPageChange(): void;
}

interface State {
  uri: string;
}

/**
 * Given a URL, get expecting parsed result based on task type.
 */
export class SogouWeb<R> extends React.Component<Props<R>, State> {
  private webview: WebView | null = null;
  constructor(props: Props<R>) {
    super(props);
    this.state = {
      uri: '',
    };
  }

  componentDidMount() {
    const { task, resource } = this.props;
    switch (task) {
      case Task.GetAccountList: {
        this.searchAccountInSogou(resource);
        break;
      }
      case Task.GetPostContent: {
        this.getPostContentInWeixin(resource);
        break;
      }
      case Task.GetPostList: {
        this.getPostListInWeixin(resource);
        break;
      }
      default:
        break;
    }
  }

  /**
   * Search account based on keyword.
   */
  private searchAccountInSogou = (query: string) => {
    this.setState({
      uri: this.buildSearchUrl(query),
    });
  };

  /**
   * Get latest posts under a certain account.
   */
  private getPostListInWeixin = (accountUrl: string) => {
    this.setState({
      uri: accountUrl,
    });
  };

  private getPostContentInWeixin = (postUrl: string) => {
    this.setState({
      uri: `https://mp.weixin.qq.com${postUrl}`,
    });
  };

  private handleLoadStart = () => {
    console.log(`Worker starts to load page. ${this.state.uri}`);
  };

  private handleLoad = () => {
    console.log('Worker loaded page successfully.');
    if (!this.webview) {
      this.props.onError(new Error('Webview is missing.'));
      this.props.onEnd();
      return;
    }

    // Ask webview to return what it gets.
    this.webview.postMessage(this.props.task);
  };

  private handleError = () => {
    console.log(`Worker failed to load page. ${this.state.uri}`);
    this.props.onError(new Error('Search post failed.'));
    this.props.onEnd();
  };

  private handleLoadEnd = () => {};

  private buildSearchUrl = (query: string, page = 1) => {
    return `https://weixin.sogou.com/weixin?query=${encodeURIComponent(
      query
    )}&_sug_type_=&s_from=input&_sug_=y&type=1&page=${page}&ie=utf8`;
  };

  private handleMessage = (event: NativeSyntheticEvent<WebViewMessageEventData>) => {
    this.handleLoadEnd();
    const message = event.nativeEvent.data;
    if (message === '') {
      this.props.onError(new Error('Got empty message'));
      this.props.onEnd();
    } else if (message.startsWith('DEBUG')) {
      console.log(message);
    } else if (message === 'PAGE_VERIFY') {
      console.log('Worker get a verify page');
      this.props.onVerify();
    } else {
      const result =
        this.props.task === Task.GetPostContent ? (message as R) : (JSON.parse(message) as R);

      this.props.onResult(result);
      this.props.onEnd();
    }
  };

  private handleNavigationStateChange = () => {
    this.props.onPageChange();
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.uri ? (
          <WebView
            originWhitelist={['*']}
            source={{ uri: this.state.uri }}
            ref={(webview) => (this.webview = webview)}
            injectedJavaScript={'(' + String(injectedJavaScript) + ')();'}
            onMessage={this.handleMessage}
            onError={this.handleError}
            onLoad={this.handleLoad}
            onLoadEnd={this.handleLoadEnd}
            onLoadStart={this.handleLoadStart}
            onNavigationStateChange={this.handleNavigationStateChange}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
