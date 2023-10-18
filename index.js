/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';

import AddNewInventory from './src/screens/InventoryScreens/AddNewInventory';
import Dashboard from './src/screens/Dashboard';
import BottomTabNavigation from './src/navigation/BottomTabNavigation'
import MyInventoryScreen from './src/screens/InventoryScreens/MyInventoryScreen';
import Marketplace from './src/screens/Marketplace';
import DealDetails from './src/screens/DealScreens/DealDetails';
import UserInformation from './src/screens/UserInformation';
import UserProfile from './src/screens/UserProfile';

import { LogBox } from 'react-native';
import {name as appName} from './app.json';
// import Dashboard from './src/screens/Dashboard';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();
AppRegistry.registerComponent(appName, () => App);

