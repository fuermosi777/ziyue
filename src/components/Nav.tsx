import { HomeScene } from '../scenes/HomeScene';
import { SearchScene } from '../scenes/SearchScene';
import { StackNavigator, StackNavigatorConfig } from 'react-navigation';

const rootNavigatorConfig: StackNavigatorConfig = {
  initialRouteName: 'Home',
  headerMode: 'none',
};

const RootNavigator = StackNavigator(
  {
    Home: {
      screen: HomeScene,
    },
    Search: {
      screen: SearchScene,
    },
  },
  rootNavigatorConfig
);

export { RootNavigator };
