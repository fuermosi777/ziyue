import * as React from 'react';
import { SafeAreaView, StyleSheet, FlatList } from 'react-native';
import { NavigationTransitionProps as Props } from 'react-navigation';
import { sogouStore } from '../stores/sogouStore';
import { observer } from 'mobx-react';
import { IAccount, IAccountDoc } from '../interfaces/account';
import { ListItem } from '../components/ListItem';
import { IPostPreview } from '../interfaces/post';
import { normalizeText } from '../utils/string';

@observer
export class AccountScene extends React.Component<Props> {
  componentDidMount() {
    const account: IAccountDoc = this.props.navigation.getParam('account');
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList<IPostPreview>
          data={sogouStore.postList}
          keyExtractor={(_item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <ListItem
                onPress={() => {}}
                title={normalizeText(item.title)}
                subtitle={normalizeText(item.preview)}
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
});
