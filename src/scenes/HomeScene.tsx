import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Image as ImageView,
  Platform,
} from 'react-native';
import { NavigationTransitionProps as Props } from 'react-navigation';
import { observer } from 'mobx-react';
import { accountStore } from '../stores/accountStore';
import { sogouStore } from '../stores/sogouStore';
import { normalizeText } from '../utils/string';
import { IPostDoc } from '../interfaces/post';
import { postStore } from '../stores/postStore';
import { Icon } from '../components/Icon';
import { Image } from '../enums/image';
import { Colors } from '../constants/colors';
import RNFetchBlob from 'rn-fetch-blob';

@observer
export class HomeScene extends React.Component<Props> {
  private handleAddPressed = () => {
    this.props.navigation.navigate('Search');
  };

  private handleAccountRefresh = () => {
    const accounts = accountStore.accounts;
    if (accounts.length > 0) {
      sogouStore.refreshPosts(accounts);
    }
  };

  private handlePostPressed = (post: IPostDoc) => {
    this.props.navigation.navigate('Post', { post });
  };

  render() {
    const { navigation } = this.props;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.nav}
          contentContainerStyle={styles.navContainer}
          horizontal
          showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.navTile}
            onPress={() => {
              navigation.navigate('AccountList');
            }}>
            <Icon icon={Image.Grid} style={styles.navIconBlue} />
            <Text style={styles.navTileLabel}>我的订阅</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navTile}
            onPress={() => {
              this.handleAccountRefresh();
            }}>
            <Icon icon={Image.Refresh} style={styles.navIconGreen} />
            <Text style={styles.navTileLabel}>刷新文章</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navTile}
            onPress={() => {
              this.handleAddPressed();
            }}>
            <Icon icon={Image.Search} style={styles.navIconRed} />
            <Text style={styles.navTileLabel}>搜索公众号</Text>
          </TouchableOpacity>
        </ScrollView>
        <FlatList<IPostDoc>
          data={postStore.posts}
          keyExtractor={(item) => item._id!}
          style={styles.contentList}
          contentContainerStyle={styles.contentContainer}
          renderItem={({ item }) => {
            let imagePath = `${RNFetchBlob.fs.dirs.DocumentDir}${item.account.imgPath}`;
            return (
              <TouchableOpacity
                style={styles.contentItem}
                onPress={() => this.handlePostPressed(item)}>
                <View style={styles.contentAccount}>
                  <ImageView
                    source={{
                      uri: Platform.OS === 'android' ? 'file://' + imagePath : '' + imagePath,
                    }}
                    style={styles.contentAccountAvatar}
                  />
                  <Text style={styles.contentAccountName} numberOfLines={1}>
                    {item.account.name}
                  </Text>
                </View>
                <Text numberOfLines={2} style={styles.contentTitle}>
                  {normalizeText(item.title)}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightBg,
  },
  header: {
    height: 44,
    flexDirection: 'row',
  },
  nav: {
    marginBottom: 15,
    height: 46,
    flexGrow: 0,
  },
  navContainer: {
    paddingHorizontal: 15,
  },
  navTile: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: Colors.LightContentBg,
    marginRight: 15,
    alignItems: 'center',
  },
  navIconBlue: {
    marginRight: 10,
    tintColor: Colors.Blue,
  },
  navIconGreen: {
    marginRight: 10,
    tintColor: Colors.Green,
  },
  navIconRed: {
    marginRight: 10,
    tintColor: '#E22856',
  },
  navTileLabel: {
    fontSize: 14,
    color: Colors.MainText,
  },
  contentList: {},
  contentContainer: {
    paddingHorizontal: 15,
  },
  contentItem: {
    backgroundColor: Colors.LightContentBg,
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  contentAccount: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  contentAccountAvatar: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginRight: 10,
  },
  contentAccountName: {
    color: Colors.SubText,
    fontSize: 13,
  },
  contentTitle: {
    fontSize: 14,
    color: Colors.MainText,
  },
});
