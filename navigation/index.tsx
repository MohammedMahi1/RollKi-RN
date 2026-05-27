import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BackButton } from '../components/BackButton';
import Main from 'screens/Main';
import ArticleScreen from 'screens/ArticleScreen';

const Stack = createStackNavigator({
  screens: {
    Main: {
      screen: Main,
    },
    ArticleScreen: {
      screen: ArticleScreen,
      options:{
        animation:"slide_from_right"
      }
    },
  },
  screenOptions:{
    headerShown: false,
  }
});

type RootNavigatorParamList = StaticParamList<typeof Stack>;

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootNavigatorParamList {}
  }
}

const Navigation = createStaticNavigation(Stack);
export default Navigation;
