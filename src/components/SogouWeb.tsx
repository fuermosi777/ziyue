import * as React from 'react';
import { View, WebView, StyleSheet } from 'react-native';
import { observer } from 'mobx-react';
import { sogouStore } from '../stores/sogouStore';
import { injectedJavaScript } from '../utils/inject';

export interface Props {}

interface State {}

@observer
export class SogouWeb extends React.Component<Props, State> {
  private webview: WebView | null = null;

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        {sogouStore.uri ? (
          <WebView
            source={{ uri: sogouStore.uri }}
            ref={(webview) => (this.webview = webview)}
            injectedJavaScript={'(' + String(injectedJavaScript) + ')();'}
            onMessage={sogouStore.handleMessage}
            onError={() => sogouStore.handleError()}
            onLoad={() => sogouStore.handleLoad(this.webview)}
            onLoadEnd={() => sogouStore.handleLoadEnd()}
            onLoadStart={() => sogouStore.handleLoadStart()}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'none',
  },
});
