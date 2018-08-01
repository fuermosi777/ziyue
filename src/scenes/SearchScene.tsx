import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  FlatList,
} from 'react-native';
import { NavigationTransitionProps as Props } from 'react-navigation';
import { sogouStore } from '../stores/sogouStore';
import { observer } from 'mobx-react';
import { IAccount } from '../interfaces/account';
import { ListItem } from '../components/ListItem';

@observer
export class SearchScene extends React.Component<Props> {
  private handleSearch = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const query = e.nativeEvent.text;
    if (query) {
      sogouStore.searchInSogou(query);
    }
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
        <FlatList<IAccount>
          data={sogouStore.accountList}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            return (
              <ListItem
                onPress={() => {}}
                title={item.name}
                subtitle={item.account}
                thumbnailUrl={item.imgUrl}
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
    paddingHorizontal: 10,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F7F8',
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
  },
});
