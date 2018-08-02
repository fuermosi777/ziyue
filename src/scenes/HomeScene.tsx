import * as React from 'react';
import { SafeAreaView, StyleSheet, View, Button, Text } from 'react-native';
import { NavigationTransitionProps as Props } from 'react-navigation';
import { observer } from 'mobx-react';
import { accountStore } from '../stores/accountStore';
import { IAccountDoc } from '../interfaces/account';

@observer
export class HomeScene extends React.PureComponent<Props> {
  private handleAddPressed = () => {
    this.props.navigation.navigate('Search');
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Button title="添加公众号" onPress={this.handleAddPressed} />
        </View>
        {accountStore.accounts.map((account: IAccountDoc) => {
          return <Text>{account.name}</Text>;
        })}
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
  },
});
