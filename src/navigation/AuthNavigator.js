import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/Splash';
import Welcome from '../screens/Welcome'
import UserInformation from '../screens/UserInformation';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='SplashScreen' 
        component={SplashScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name='Welcome'
        component={Welcome}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name='UserInformation'
        component={UserInformation}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}