import * as React from 'react';
import {
  SafeAreaView,
  WebView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from 'react-native';
import { NavigationTransitionProps as Props } from 'react-navigation';
import { IPostDoc } from '../interfaces/post';
import RNFetchBlob from 'rn-fetch-blob';
import { style as postStyle } from '../utils/postContentStyle';
import { postStore } from '../stores/postStore';
import { Icon } from '../components/Icon';
import { Image } from '../enums/image';
import { Colors } from '../constants/colors';

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
    console.log('end');
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
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <View style={styles.backButton}>
            <Icon icon={Image.LeftArrow} style={styles.backIcon} width={16} height={16} />
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backButton: {
    position: 'absolute',
    width: 44,
    height: 44,
    right: 20,
    bottom: 40,
    borderRadius: 22,
    backgroundColor: Colors.LightContentBg,
    justifyContent: 'center',
    alignItems: 'center',

    // shadow
    shadowColor: Colors.MainText,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0.35,
      height: 0.35,
    },
  },
  backIcon: {
    tintColor: Colors.Blue,
  },
});
