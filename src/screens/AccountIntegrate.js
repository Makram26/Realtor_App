import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, RefreshControl, TextInput, Linking } from 'react-native'

import { HeaderStyle } from '../constants/Styles'
import { AuthContext } from '../auth/AuthProvider'

import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Ionicons'

import Spinner from 'react-native-loading-spinner-overlay';
import { login, storeData } from '../services';
import { ScrollView } from 'react-native';
import firestore from '@react-native-firebase/firestore'

const Header = ({ goBack, profile }) => {
    return (
        <View style={HeaderStyle.mainContainer}>
            <View style={HeaderStyle.arrowbox}>
                <TouchableOpacity onPress={goBack}>
                    <Icon name="left" color="#1A1E25" size={20} />
                </TouchableOpacity>
            </View>

            <View style={HeaderStyle.HeaderTextContainer}>
                <Text style={HeaderStyle.HeaderText}>Accounting Integration</Text>
                <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: profile }} />
            </View>
        </View>
    )
}

export default function AccountIntegrate({ navigation }) {
    const { user } = useContext(AuthContext)

    const [loading, setLoading] = useState(false)

    const [state, setState] = useState({
        userId: "",
        password: "",
        database: "",
        URL: ""
    })
    const [synchData, setSynchData] = useState("")


    useEffect(() => {
        getIntegrationData()
    }, [])
    const getIntegrationData = async () => {
        setLoading(true)
        let tempRecord = []
        await firestore().collection('odooIntegration')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const { user_id, URL, database, loginId, password } = doc.data()

                    if (user_id === user.uid) {
                        tempRecord.push({
                            database: database,
                            URL: URL,
                            loginId: loginId,
                            // password: password
                        });

                    }


                });
            })

        setSynchData(tempRecord)
        setLoading(false)
    }

    console.log(">>>>>>>>>>>>>>>>>>>>", synchData)
    console.log("synchData.length", synchData.length)

    const SynchToOdoo = async () => {
        if (state.userId != "" && state.password != "" && state.database != "" && state.URL != "") {
            setLoading(true)

            try {
                let response = await login(state.userId.trim(), state.password.trim(), state.database.trim(), state.URL.trim())
                console.log("res", response);
                if (response.result != undefined) {
                    // storeData(state.userId, state.password, state.database, state.URL)
                    try {
                        firestore()
                            .collection('odooIntegration')
                            .add({
                                loginId: state.userId,
                                // password: state.password,
                                database: state.database,
                                URL: state.URL,
                                user_id: user.uid
                            }).then(doc => {
                                setState({ ...state, userId: "", password: "", database: "", URL: "" })
                                alert("Successfully synch your Account to Odoo!")
                                navigation.goBack()
                                setLoading(false)
                            })
                    } catch (err) {
                        console.log(err)
                        setLoading(false)
                    }

                    // navigation.navigate("AppNavigator")
                }
                //   else if(response.error.data.message == "already_logged_in"){
                //    setLoading(false)
                //    console.log(">>>>>>>>>>",response.error.data.message)
                //    alert("User already logged in. Log out from other devices and try again.")
                //   }
                else {
                    setLoading(false)
                    alert("Your Credentials do not match!")
                }
            } catch (error) {
                setLoading(false)
                alert("Please Check your URL?")
                console.log("error", error)
            }

        }
        else {
            alert("Please fill all mandatory fields")
        }

    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FCFCFC', }}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <Header
                goBack={() => navigation.goBack()}
                profile={user.photoURL}
            />
            {
                synchData && synchData.length == 0 ?
                    <ScrollView keyboardShouldPersistTaps="always" showsVerticalScrollIndicator={false} style={{ flex: 1, margin: 18, }}>

                        <Text style={{ color: "#000000", fontWeight: "500", textAlign: "center", lineHeight: 20, fontSize: 16 }}>Please Enter Your Odoo Credentials To Start Synchronization</Text>
                        <View style={{ width: "100%", marginTop: 20 }}>
                            {/* User Id */}
                            <Text style={styles.textHeading}>
                                User Id
                                <Text style={{ color: 'red' }}> *</Text>
                            </Text>
                            <TextInput
                                style={styles.inputStyle}
                                placeholder='Enter User Id'
                                placeholderTextColor={"#A1A1A1"}
                                value={state.userId}
                                onChangeText={(value) => setState({ ...state, userId: value })}

                            />
                            {/* Password */}
                            <Text style={[styles.textHeading, { marginTop: 15 }]}>
                                Password
                                <Text style={{ color: 'red' }}> *</Text>
                            </Text>
                            <TextInput
                                placeholder='Enter Password'
                                placeholderTextColor={"#A1A1A1"}
                                value={state.password}
                                onChangeText={(value) => setState({ ...state, password: value })}
                                style={styles.inputStyle}
                            />
                            {/* Database */}
                            <Text style={[styles.textHeading, { marginTop: 15 }]}>
                                Database
                                <Text style={{ color: 'red' }}> *</Text>
                            </Text>
                            <TextInput
                                placeholder='Enter Password'
                                placeholderTextColor={"#A1A1A1"}
                                value={state.database}
                                onChangeText={(value) => setState({ ...state, database: value })}
                                style={styles.inputStyle}
                            />
                            {/* URL */}
                            <Text style={[styles.textHeading, { marginTop: 15 }]}>
                                URL
                                <Text style={{ color: 'red' }}> *</Text>
                            </Text>
                            <TextInput
                                placeholder='Enter Password'
                                placeholderTextColor={"#A1A1A1"}
                                value={state.URL}
                                onChangeText={(value) => setState({ ...state, URL: value })}
                                style={styles.inputStyle}
                            />
                            <TouchableOpacity onPress={() => SynchToOdoo()} style={styles.saveBtnContainer}>
                                <Text style={styles.textSave}>Save</Text>
                            </TouchableOpacity>
                        </View>





                    </ScrollView>
                    :
                    <View style={{ flex: 1,justifyContent:"center",alignItems:"center",}}>
                        <Text style={{fontSize:16,fontWeight:"600",color:"#000000"}}>Already Synchronization to Odoo!</Text>
                    </View>

            }

        </View>
    )
}

const styles = StyleSheet.create({
    textHeading: {
        color: "#1A1E25",
        fontSize: 14,
        fontWeight: "900",
    },
    inputStyle: {
        width: "100%",
        textAlign: "left",
        borderBottomWidth: 1,
        borderColor: "#E2E2E2",
        color: "#000000",
        paddingLeft: 0,
        paddingBottom: 0,
        fontSize: 12,
        fontWeight: "500",
        marginTop: -10,
    },
    saveBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        padding: 14,
        // height: 47,
        // width: "98%",
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#836AF8",
    },
    textSave: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "900"
    },
})