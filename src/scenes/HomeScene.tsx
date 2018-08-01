import * as React from 'react';
import { SafeAreaView, StyleSheet, View, Button } from 'react-native';
import { NavigationTransitionProps as Props } from 'react-navigation';

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
