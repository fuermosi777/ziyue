import * as React from 'react';
import { SafeAreaView, WebView, StyleSheet } from 'react-native';
import { NavigationTransitionProps as Props } from 'react-navigation';
import { IPostDoc } from '../interfaces/post';
import RNFetchBlob from 'rn-fetch-blob';
import { style as postStyle } from '../utils/postContentStyle';
import { Colors } from '../constants/colors';
import { postStore } from '../stores/postStore';

interface State {
  html: string;
}

export class PostScene extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      html: '',
    };
  }
  componentDidMount() {
    const post: IPostDoc = this.props.navigation.getParam('post');
    this.loadHtml(post);
  }
  private handleLoad = async () => {
    const post: IPostDoc = this.props.navigation.getParam('post');
    try {
      await postStore.readPost(post);
    } catch (err) {
      console.log('Failed to mark post as read. ' + err.message);
    }
  };
  private loadHtml = async (post: IPostDoc) => {
    try {
      let postPath = `/post/${post._id}.html`;
      let html = await RNFetchBlob.fs.readFile(
        `${RNFetchBlob.fs.dirs.DocumentDir}${postPath}`,
        'utf8'
      );
      this.setState({ html: `${postStyle}${html}` });
    } catch (err) {
      console.log(`Failed to load HTML from file. ${err.message}`);
    }
  };
  render() {
    const { html } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        {html ? (
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            scalesPageToFit={false}
            onLoadStart={this.handleLoad}
          />
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backIcon: {
    tintColor: Colors.Blue,
  },
});
