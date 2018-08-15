import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { RootNavigator } from './components/Nav';
import { sogouStore } from './stores/sogouStore';
import { observer } from 'mobx-react';
import { PreloadModal } from './components/PreloadModal';
import { LoadingIndicator } from './components/LoadingIndicator';

type Props = {};

@observer
export default class App extends React.Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <RootNavigator />
        <PreloadModal visible={sogouStore.isWorkerVisible}>{sogouStore.worker}</PreloadModal>
        <PreloadModal visible={sogouStore.isSearchWorkerVisible}>
          {sogouStore.searchWorker}
        </PreloadModal>
        <LoadingIndicator show={sogouStore.status !== ''} label={sogouStore.status} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
