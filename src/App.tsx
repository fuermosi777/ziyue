import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { SogouWeb } from './components/SogouWeb';
import { RootNavigator } from './components/Nav';

type Props = {};
export default class App extends React.Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <SogouWeb />
        <RootNavigator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
