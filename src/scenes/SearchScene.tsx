import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { NavigationTransitionProps as Props } from 'react-navigation';
import { sogouStore } from '../stores/sogouStore';
import { observer } from 'mobx-react';
import { IAccount } from '../interfaces/account';
import { ListItem } from '../components/ListItem';
import { accountStore } from '../stores/accountStore';
import { Colors } from '../constants/colors';

interface State {
  accountList: IAccount[];
  hasNext: boolean;
}

@observer
export class SearchScene extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      accountList: [],
      hasNext: false,
    };
  }
  private handleSearch = async (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    try {
      const query = e.nativeEvent.text;
      if (query) {
        const result = await sogouStore.searchAccounts(query);
        this.setState({ accountList: result.items, hasNext: result.hasNext });
      }
    } catch (err) {
      console.log(err);
    }
  };
  private handleAddAccountPressed = (account: IAccount) => {
    accountStore.addAccount(account);
    this.props.navigation.goBack();
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TextInput
            style={styles.input}
            placeholder="输入公众号名字"
            returnKeyType="search"
            onSubmitEditing={this.handleSearch}
            clearButtonMode="while-editing"
            placeholderTextColor="#D7DDE6"
          />
        </View>
        {sogouStore.searchStatus !== '' ? (
          <ActivityIndicator size="small" style={styles.loader} />
        ) : (
          <FlatList<IAccount>
            data={this.state.accountList}
            keyExtractor={(item) => item.account}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              return (
                <ListItem
                  onPress={() => this.handleAddAccountPressed(item)}
                  title={item.name}
                  subtitle={item.account}
                  thumbnailUrl={item.imgUrl}
                />
              );
            }}
          />
        )}
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
    paddingHorizontal: 10,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F7F8',
    justifyContent: 'center',
    backgroundColor: Colors.LightContentBg,
  },
  list: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  loader: {
    marginTop: 40,
  },
  input: {
    fontSize: 16,
  },
});
