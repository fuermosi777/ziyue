import * as React from 'react';
import { SafeAreaView, FlatList, StyleSheet, Platform, View, TouchableOpacity } from 'react-native';
import { NavigationTransitionProps as Props } from 'react-navigation';
import { ListItem } from '../components/ListItem';
import RNFetchBlob from 'rn-fetch-blob';
import { observer } from 'mobx-react';
import { accountStore } from '../stores/accountStore';
import { IAccountDoc } from '../interfaces/account';
import { sogouStore } from '../stores/sogouStore';
import { Icon } from '../components/Icon';
import { Image } from '../enums/image';
import { Colors } from '../constants/colors';

@observer
export class AccountListScene extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  private handleAccountPressed = (account: IAccountDoc) => {
    // this.props.navigation.navigate('Account', {
    //   account,
    // });
    sogouStore.killWorker();
    accountStore.removeAccount(account);
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Icon icon={Image.LeftArrow} style={{ tintColor: Colors.MainText }} />
          </TouchableOpacity>
        </View>
        <FlatList<IAccountDoc>
          data={accountStore.accounts}
          keyExtractor={(item) => item._id!}
          renderItem={({ item }) => {
            let imagePath = `${RNFetchBlob.fs.dirs.DocumentDir}${item.imgPath}`;
            return (
              <ListItem
                onPress={() => {
                  this.handleAccountPressed(item);
                }}
                title={item.name}
                subtitle={item.account}
                thumbnailUrl={Platform.OS === 'android' ? 'file://' + imagePath : '' + imagePath}
              />
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
    backgroundColor: 'white',
  },
  header: {
    height: 44,
    flexGrow: 0,
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
});
