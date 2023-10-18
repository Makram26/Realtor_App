import React, { useState, useContext } from 'react';
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
import Feather from 'react-native-vector-icons/Feather';
import Key from 'react-native-vector-icons/Entypo'
import PersonIcon from 'react-native-vector-icons/Fontisto'
export default function Login({navigation}) {
    const [oldsecureTextEntry, setOldSecureTextEntry] = useState(false)
    const updateOldSecureTextEntry = () => {
        setOldSecureTextEntry(!oldsecureTextEntry);
    }
    return (
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={LogInScreenStyle.container}>
            <View style={LogInScreenStyle.Header}>
                <Text style={LogInScreenStyle.WolcomeText}>Welcome!</Text>
                <Text style={[LogInScreenStyle.HeaderText,{marginBottom:20}]}>Sign in and get started</Text>
            </View>
            <View style={{ flex: 1, marginTop: 20, margin: 30 }}>
                <Text style={LogInScreenStyle.headingMobileText}>Mobile Number</Text>
                <View style={LogInScreenStyle.MobileNumberContainer}>
                    <View style={LogInScreenStyle.personIcon}>
                        <PersonIcon name="person" color="#6681E6" size={20} />
                    </View>
                    <TextInput
                        placeholder="Mobile Number"
                        style={LogInScreenStyle.MobileInput}
                    // value={email}
                    // onChangeText={(value) => setEmail(value)}
                    />
                </View>
                <Text style={LogInScreenStyle.headingPassword}>Password</Text>
                <View style={LogInScreenStyle.PasswordContainer}>
                    <View style={LogInScreenStyle.KeyIcon}>
                        <Key name="key" color="#7D7F88" size={20} />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TextInput
                            placeholder="Password"
                            style={LogInScreenStyle.PasswordInput}
                            secureTextEntry={oldsecureTextEntry ? false : true}
                        // value={email}
                        // onChangeText={(value) => setEmail(value)}
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
                <TouchableOpacity onPress={() =>  navigation.navigate("BottomTabNavigation")} style={LogInScreenStyle.LoginBtn}>
                    <Text style={LogInScreenStyle.LoginBtnText}>Log In</Text>
                </TouchableOpacity>
                <Text style={LogInScreenStyle.ForgotText}>Forgot password?</Text>
                <View style={LogInScreenStyle.Drawline} />
                <View style={LogInScreenStyle.ORContainer}>
                    <Text style={LogInScreenStyle.ORText}>OR</Text>
                </View>
                <TouchableOpacity onPress={() =>  navigation.navigate("SignUp")} style={LogInScreenStyle.SignUpBtn}>
                    <Text style={LogInScreenStyle.SingUpText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

