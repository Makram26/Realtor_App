import React, { useState, useContext, useEffect } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Dimensions
} from 'react-native';
import { LogInScreenStyle } from '../constants/Styles';
import { SignUpScreenStyle } from '../constants/Styles';
import Feather from 'react-native-vector-icons/Feather';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore';



import { Picker } from '@react-native-picker/picker';
import { MaskedTextInput } from "react-native-mask-text"
import Key from 'react-native-vector-icons/Entypo'
import PersonIcon from 'react-native-vector-icons/Fontisto'
var country = [
    {
        id: 1,
        name: "pakistan"
    },
    {
        id: 2,
        name: "India"
    },
    {
        id: 3,
        name: "USA"
    }

]
var city = [
    {
        id: 1,
        name: "Lahore"
    },
    {
        id: 2,
        name: "Kasur"
    },
    {
        id: 3,
        name: "Karachi"
    }
]
GoogleSignin.configure({
    webClientId: '975680620261-opas3mrbnf5hn5i3h5r1mhhmeckdnti1.apps.googleusercontent.com',
    // offlineAccess: true
});
export default function SignUp({navigation}) {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const [oldsecureTextEntry, setOldSecureTextEntry] = useState(false)
    const [value, setValue] = useState(null);
    const [valueCity, setValueCity] = useState(null);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [selectCountry, setSelectCountry] = useState("")
    const [selectCity, setSelectCity] = useState("")
    const [categories, setCategories] = useState([])
    const [mobile, setMobile] = useState("")
    const updateOldSecureTextEntry = () => {
        setOldSecureTextEntry(!oldsecureTextEntry);
    }
    const OnchangePickerSeletedHandler = (value, index) => {
        setValue(value)
        setSelectCountry(country[index].name)
    }
    const OnchangePickerSeletedHandlerCity = (value, index) => {
        setValueCity(value)
        setSelectCity(city[index].name)
    }

   




    // function onAuthStateChanged(user) {
    //     setUser(user);
    //     if (initializing) setInitializing(false);
    // }
    // useEffect(() => {
    //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    //     return subscriber; // unsubscribe on unmount
    // }, []);
    const onSignUp = async () => {



        try {

          
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn();

            // console.log("idToken", idToken)

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            // console.log("googleCredential", googleCredential)
                // Sign-in the user with the credential
                //    const response = auth().signInWithCredential(googleCredential);

                //    console.log("response",response)
               

                 const response    =await auth().signInWithCredential(googleCredential)
                //  console.log(response)

                 navigation.navigate("BottomTabNavigation")
                



                } catch (error) {
                   
                }


            // firestore().collection('users')
            //     .get()
            //     .then(querySnapshot => {
            //         auth().createUserWithEmailAndPassword(email, password)
            //             .then((response) => {
            //                 const uid = response.user.uid
            //                 const data = {
            //                     id: uid,
            //                     email,


            //                     password
            //                 };
            //                 firestore().collection('users')
            //                     .doc(uid)
            //                     .set(data)
            //                     .then(() => {
            //                         alert("successfully SignUp")
            //                     })
            //                     .catch((error) => {
            //                         alert(error)
            //                         console.log(error)
            //                     });
            //             })
            //             .catch(error => {
            //                 if (error.code === 'auth/email-already-in-use') {
            //                     alert('That email address is already in use!');
            //                 }
            //                 if (error.code === 'auth/invalid-email') {
            //                     alert('That email address is invalid!');
            //                 }
            //             });

            //     })
            //     .catch(error => {
            //         alert(error)
            //     });
        }


    const onSignOut = async () => {
            // const user = auth().currentUser;

            // console.log(user)
            try {
                await auth().signOut()
                alert("successfully logout")
            } catch (e) {
                console.error(e)
            }

        }



        return (


            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled' contentContainerStyle={LogInScreenStyle.container}>
                <View style={[LogInScreenStyle.Header, { height: "9%" }]}>
                    <Text style={LogInScreenStyle.WolcomeText}>New Account</Text>
                    <Text style={LogInScreenStyle.HeaderText}>Signup up and get started</Text>
                </View>
                <View style={{ flex: 1, marginTop: 5, margin: 30 }}>
                    <Text style={SignUpScreenStyle.Heading}>Full Name</Text>
                    <View style={LogInScreenStyle.PasswordContainer}>
                        <TextInput
                            placeholder="Enter Full Name"
                            placeholderTextColor={"#7D7F88"}
                            style={SignUpScreenStyle.inputTextStyle}
                            // secureTextEntry={oldsecureTextEntry ? false : true}
                            value={email}
                            onChangeText={(value) => setEmail(value)}
                        />
                    </View>
                    <Text style={SignUpScreenStyle.Heading}>Password</Text>
                    <View style={LogInScreenStyle.PasswordContainer}>
                        <View style={LogInScreenStyle.KeyIcon}>
                            <Key name="key" color="#7D7F88" size={20} />
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TextInput
                                placeholder="Enter Password"
                                style={LogInScreenStyle.PasswordInput}
                                secureTextEntry={oldsecureTextEntry ? false : true}
                                value={password}
                                onChangeText={(value) => setPassword(value)}
                            />
                            <TouchableOpacity onPress={updateOldSecureTextEntry} style={LogInScreenStyle.HideShowIcon} >
                                {
                                    oldsecureTextEntry ?
                                        <Feather name="eye" color="grey" size={20} />
                                        :
                                        <Feather name="eye-off" color="grey" size={20} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={SignUpScreenStyle.Heading}>Where do you operate?</Text>
                    <View style={LogInScreenStyle.PasswordContainer}>
                        <TextInput
                            placeholder="Enter text here..."
                            placeholderTextColor={"#7D7F88"}
                            style={SignUpScreenStyle.inputTextStyle}
                        // secureTextEntry={oldsecureTextEntry ? false : true}
                        // value={email}
                        // onChangeText={(value) => setEmail(value)}
                        />
                    </View>
                    <Text style={SignUpScreenStyle.Heading}>Country</Text>
                    <View style={SignUpScreenStyle.InputBox}>
                        <Picker
                            selectedValue={value}
                            onValueChange={(itemValue, itemIndex) => OnchangePickerSeletedHandler(itemValue, itemIndex)}
                            itemStyle={{ color: "white" }} >
                            {
                                country.map((item, index) => {
                                    return (
                                        <Picker.Item label={item.name} value={item.id} />
                                    )
                                })
                            }
                        </Picker>
                    </View>
                    <Text style={SignUpScreenStyle.Heading}>City</Text>
                    <View style={SignUpScreenStyle.InputBox}>
                        <Picker
                            selectedValue={valueCity}
                            onValueChange={(itemValue, itemIndex) => OnchangePickerSeletedHandlerCity(itemValue, itemIndex)}
                            itemStyle={{ color: "white" }} >
                            {
                                city.map((item, index) => {
                                    return (
                                        <Picker.Item label={item.name} value={item.id} />
                                    )
                                })
                            }
                        </Picker>
                    </View>
                    <Text style={SignUpScreenStyle.Heading}>Phone number</Text>
                    <View style={LogInScreenStyle.PasswordContainer}>
                        <MaskedTextInput
                            placeholder="Enter Mobile Number"
                            type="custom"
                            mask="0399-9999999"
                            keyboardType='phone-pad'
                            onChangeText={(val) => setMobile(val)}
                            style={SignUpScreenStyle.inputTextStyle}
                        />
                    </View>
                    <TouchableOpacity onPress={() => onSignUp()} style={SignUpScreenStyle.Button}>
                        <Text style={SignUpScreenStyle.btnText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onSignOut()} style={SignUpScreenStyle.Button}>
                        <Text style={SignUpScreenStyle.btnText}>Sign out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }