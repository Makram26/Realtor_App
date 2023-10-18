import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    Text,
    View,
    BackHandler,
    Alert
} from 'react-native';

import { WelcomeScreenStyles } from '../constants/Styles';

import { AuthContext } from "../auth/AuthProvider"
import useAuth from '../auth/useAuth';
import AreasAPI from '../api/AreaAPI'

import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging'
import auth from '@react-native-firebase/auth'
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SocialIcon } from "react-native-elements";


export default function Welcome({ navigation }) {
    const [loading, setLoading] = useState(false)

    const { Googlelogin } = useContext(AuthContext)

    // useEffect(() => {
    //     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
    //     return () => backHandler.remove()
    // }, [])

    const [deviceToken, setDeviceToken] = useState('')
    messaging().getToken().then(token => {
        setDeviceToken(token)
    })

    useEffect(() => {
        // back handle exit app
        BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
        };
    }, []);
    const backButtonHandler = () => {
        // const shortToast = message => {
        //     Toast.show(message, {
        //         duration: Toast.durations.LONG,
        //         position: Toast.positions.BOTTOM, c                    
        //     });
        // }
        // let backHandlerClickCount;
        // backHandlerClickCount += 1;
        // shortToast('Press again to quit the application');
        // if ((backHandlerClickCount < 2)) {
            
        // } else {
        //     // alert("exit app")
        //     BackHandler.exitApp();
        // }

        // timeout for fade and exit
        // setTimeout(() => {
        //     backHandlerClickCount = 0;
        // }, 1000);
        BackHandler.exitApp()
        return true;
    }
    const GoogleLogin = async () => {

        setLoading(true)

        // const res = await Googlelogin()
        try {
            const userInfo = await GoogleSignin.signIn()
            var userList = [];
            // check if email exists in employee table
            firestore()
                .collection('UserSettings').where('email', '==', userInfo.user.email)
                .get()
                .then(async (querySnapshot) => {
                    const duplicate_email = querySnapshot.size
                    console.log("::", duplicate_email)

                    // if does not exists
                    if (duplicate_email == 0) {

                        // check if email exists in users table
                        firestore()
                            .collection('users').where('email', '==', userInfo.user.email)
                            .get()
                            .then(async (querySnapshot) => {

                                const duplicate_email = querySnapshot.size
                                if (duplicate_email == 0) {

                                    navigation.navigate('UserInformation', userInfo)
                                    setLoading(false)
                                } else {


                                    const res = await Googlelogin()


                                    const user = auth().currentUser;

                                    // console.log(res.additionalUserInfo.isNewUser)
                                    // const newUser = res.additionalUserInfo.isNewUser
                                    try {
                                        await firestore()
                                            .collection("users")
                                            .doc(user.uid)
                                            .update({
                                                id: user.uid,
                                                email: user.email,
                                                image: user.photoURL,
                                                mobile: user.phoneNumber,
                                                username: user.displayName,
                                                role: "business",
                                                timestamp: firestore.Timestamp.fromDate(new Date())
                                            })
                                            .then(() => {


                                                setLoading(false)
                                                // navigation()
                                                // setAlertModal(true)
                                                // console.log("sent to notifications")
                                            });
                                    } catch (e) {
                                        console.log("e1", e)
                                        Alert.alert("Something went wrong", "Please try again")
                                        setLoading(false)
                                    }
                                }
                            })
                    }
                    else {


                        await firestore()
                            .collection('UserSettings')
                            .where('email', '==', userInfo.user.email)
                            .get()
                            .then(async (querySnapshot) => {
                                querySnapshot.forEach(doc => {
                                    const { name, mobile, cityID, city, status, countryID, country } = doc.data()


                                    userList.push({
                                        id: doc.id,
                                        name: name,
                                        contact: mobile,
                                        cityID: cityID,
                                        city: city,
                                        status: status,
                                        countryID: countryID,
                                        country: country
                                    });
                                });
                            })



                        if (userList[0].status == "Active") {
                            // console.log("userList[0].status",userList[0].status)

                            const res = await Googlelogin()

                            const user = auth().currentUser;

                            // console.log("user=>>>>>>", user)
                            // console.log(res.additionalUserInfo.isNewUser)
                            // const newUser = res.additionalUserInfo.isNewUser
                            try {
                                await firestore()
                                    .collection("UserSettings")
                                    .doc(userList[0].id)
                                    .update({
                                        name: userList[0].name,
                                        mobile: userList[0].contact,
                                        admin_id: user.uid,
                                        uid: user.uid,
                                        latestLogin: firestore.Timestamp.fromDate(new Date()),
                                        deviceToken: deviceToken
                                    })
                                    .then(async () => {

                                        await storeDataHandler(userList[0].cityID, userList[0].city, userList[0].countryID, userList[0].country)
                                        // setLoading(false)
                                        // navigation()
                                        // setAlertModal(true)
                                        // console.log("sent to notifications")
                                    });
                            } catch (e) {


                                console.log("e1", e)
                                Alert.alert("Something went wrong", "Please try again")
                                setLoading(false)
                            }
                        }
                        else {


                            Alert.alert("You are not allowed to Login")
                            setLoading(false)
                        }
                    }
                })
        } catch (error) {
            console.log("in side catch", error)
            setLoading(false)

        }

    }

    const storeDataHandler = async (cityID, city, countryID, country) => {
        setLoading(true)
        const response = await AreasAPI.getSocieties(countryID, cityID)
        // console.log(">>>>>>>>>>>>>>>",response)
        if (response.ok) {
            var data = response.data.response
            // console.log(data)
            // data = data.toString().replace(/'/g, '"');
            // console.log(">>>>>>>>>>>>",data)
            // data = JSON.parse(data);
            // // console.log(typeof data)
            // console.log(data)
            // setData(data)
            useAuth().areas(data, city, cityID, country, countryID)
            // console.log("data added to storage")
            setLoading(false)
        }
        else {
            // Alert.alert("Error")
            setLoading(false)
        }
    }

    const FacebookLogin = () => {
        alert("Coming Soon............")
    }
    return (
        <View style={WelcomeScreenStyles.container}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <View style={{ flex: 0.7, }}>
                <Image style={WelcomeScreenStyles.imageStyle} resizeMode='stretch' source={require('../assets/images/Gallery.png')} />
            </View>
            <View style={{ flex: 0.3 }}>
                <Text style={WelcomeScreenStyles.notesText}>Are you ready to uproot and start over in a new area?</Text>
                <Text style={[WelcomeScreenStyles.notesText, {}]}>Axiom will help you on your journey!</Text>
                {/* <TouchableOpacity  onPress={()=> PressHandler()}
                    //  onPress={() =>  navigation.navigate("Login")} 
                     style={WelcomeScreenStyles.siginContainer}>
                        <Text style={WelcomeScreenStyles.siginText}>Log in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                    // onPress={() =>  navigation.navigate("SignUp")}  
                    style={WelcomeScreenStyles.signupContainer}>
                        <Text style={WelcomeScreenStyles.signupText}>Sign up</Text>
                    </TouchableOpacity> */}

                <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                    <SocialIcon
                        title="Sign In With Google"
                        button
                        type="google"
                        // style={WelcomeScreenStyles.SocialIcon}
                        onPress={() => GoogleLogin()}
                    />

                </View>
                <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                    <SocialIcon
                        title="Sign In With Facebook"
                        button
                        type="facebook"
                        //   style={styles.SocialIcon}
                        onPress={() => FacebookLogin()}
                    />

                </View>

            </View>
        </View>
    );
}

// gujjarjahanzaib37@gmail.com