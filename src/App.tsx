import * as React from 'react';
import { StyleSheet, Button, SafeAreaView } from 'react-native';
import { SogouWeb } from './components/SogouWeb';

type Props = {};
export default class App extends React.Component<Props> {
  private sogou: SogouWeb | null = null;

  handlePressed = () => {
    if (this.sogou) {
      this.sogou.search('包邮');
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Button onPress={this.handlePressed} title="search"/>
        <SogouWeb ref={sogou => this.sogou = sogou}/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
