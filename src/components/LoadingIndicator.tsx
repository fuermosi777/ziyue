import * as React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Text,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Colors } from '../constants/colors';

interface Style {
  container: ViewStyle;
  tile: ViewStyle;
  label: TextStyle;
}

export interface Props {
  show: boolean;
  label?: string;
}

interface State {
  translateY: Animated.Value;
}

export class LoadingIndicator extends React.PureComponent<Props, State> {
  private styles: Style;
  public static defaultProps = {
    label: '载入中...',
  };
  constructor(props: Props) {
    super(props);
    this.styles = StyleSheet.create<Style>({
      container: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        height: 36,
        alignItems: 'center',
        paddingHorizontal: 15,
      },
      tile: {
        flex: 1,
        paddingHorizontal: 20,
        flexDirection: 'row',
        backgroundColor: Colors.Green,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 18,
        shadowColor: Colors.MainText,
        shadowOpacity: 0.3,
        shadowOffset: {
          width: 0.35,
          height: 0.35,
        },
      },
      label: {
        color: Colors.LightContentBg,
        fontSize: 14,
        marginLeft: 10,
      },
    });
    this.state = {
      translateY: new Animated.Value(100),
    };
  }
  componentWillReceiveProps(newProps: Props) {
    if (newProps.show) {
      this.showIndicator();
    } else {
      this.hideIndicator();
    }
  }
  private showIndicator = () => {
    Animated.timing(this.state.translateY, {
      toValue: 0,
      duration: 200,
    }).start();
  };
  private hideIndicator = () => {
    Animated.timing(this.state.translateY, {
      toValue: 100,
      duration: 200,
    }).start();
  };
  render() {
    let { label } = this.props;
    if (label === '') {
      label = '载入中...';
    }
    const { translateY } = this.state;
    return (
      <View style={this.styles.container}>
        <Animated.View style={[this.styles.tile, { transform: [{ translateY }] }]}>
          <ActivityIndicator color={Colors.LightContentBg} size="small" />
          <Text style={this.styles.label} numberOfLines={1}>
            {label}
          </Text>
        </Animated.View>
      </View>
    );
  }
}
