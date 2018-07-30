import * as React from 'react';
import {
  View,
  WebView,
  StyleSheet,
  NativeSyntheticEvent,
  WebViewMessageEventData,
} from 'react-native';

export interface Props {}

interface State {
  url: string
}

const injectedJavaScript = () => {
  document.addEventListener('message', function(_data) {
    window.postMessage('123', '');
  });
};

function buildSearchUrl(query: string, page = 1) {
  return `https://weixin.sogou.com/weixin?query=${encodeURIComponent(query)}&_sug_type_=&s_from=input&_sug_=y&type=1&page=${page}&ie=utf8`;
}

export class SogouWeb extends React.Component<Props, State> {
  private webview: WebView | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      url: ''
    }
  }

  private handleLoadEnd = () => {
    if (this.webview) {
      this.webview.postMessage('123');
    }
  };

  private handleMessage = (event: NativeSyntheticEvent<WebViewMessageEventData>) => {
    console.log(event.nativeEvent.data);
  };

  render() {
    return (
      <View style={styles.container}>
        <WebView
          
          source={{ uri: this.state.url }}
          ref={(webview) => (this.webview = webview)}
          injectedJavaScript={'(' + String(injectedJavaScript) + ')();'}
          onMessage={this.handleMessage}
          onLoadEnd={this.handleLoadEnd}
        />
      </View>
    );
  }

  public search(query: string) {
    this.setState({url: buildSearchUrl(query)});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
