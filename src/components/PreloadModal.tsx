import * as React from 'react';
import { Animated, StyleSheet, Dimensions } from 'react-native';

export interface Props {
  visible: boolean;
}
interface State {
  top: Animated.Value;
}

const screen = Dimensions.get('screen');
const horizontalMargin = 0;
const vericalMargin = 0;

class PreloadModal extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      top: new Animated.Value(screen.height),
    };
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.visible) {
      Animated.timing(this.state.top, {
        toValue: vericalMargin,
        duration: 200,
      }).start();
    } else {
      Animated.timing(this.state.top, {
        toValue: screen.height,
        duration: 200,
      }).start();
    }
  }
  render() {
    const { top } = this.state;
    return <Animated.View style={[styles.container, { top }]}>{this.props.children}</Animated.View>;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: screen.width - horizontalMargin * 2,
    height: screen.height - vericalMargin * 2,
    left: horizontalMargin,
  },
});

export { PreloadModal };
