/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import { backgroundMessageHandler } from './src/utils/NotificationHelper';

messaging().setBackgroundMessageHandler(backgroundMessageHandler);


AppRegistry.registerComponent(appName, () => App);

