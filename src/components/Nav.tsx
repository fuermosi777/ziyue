import { HomeScene } from '../scenes/HomeScene';
import { SearchScene } from '../scenes/SearchScene';
import { AccountScene } from '../scenes/AccountScene';
import { AccountListScene } from '../scenes/AccountListScene';
import { PostScene } from '../scenes/PostScene';
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
    Account: {
      screen: AccountScene,
    },
    AccountList: {
      screen: AccountListScene,
    },
    Post: {
      screen: PostScene,
    },
  },
  rootNavigatorConfig
);

export { RootNavigator };
