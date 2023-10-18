import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import AuthNavigator from './AuthNavigator'
import BottomTabNavigation from '../navigation/BottomTabNavigation'
// import Login from '../screens/Login'
import { AuthContext } from "../auth/AuthProvider";

import messaging from '@react-native-firebase/messaging'

export default function Routes() {
    const { user, setUser } = useContext(AuthContext)
    const [initializing, setInitializing] = useState(true)

    // function onAuthStateChanged(user) {
    //     setUser(user)
    //     if (initializing) setInitializing(false)
    //     // setLoading(false)
    // }
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return subscriber
    }, [])

    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //     navigation.navigate('Leads'); //navigate to notification screen
    // });
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    // })

    return (
        <NavigationContainer>
            {user ?
                <BottomTabNavigation />
                :
                <AuthNavigator />
            }
        </NavigationContainer>
    )
}