import React, { useState, useEffect, useContext } from 'react';
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
    FlatList,
    ScrollView,
    Dimensions,
    BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { HeaderStyle } from '../constants/Styles';
import { AuthContext } from '../auth/AuthProvider';
import firestore from '@react-native-firebase/firestore'
import Spinner from 'react-native-loading-spinner-overlay';

export default function Feedback({ route, navigation }) {
    const { user } = useContext(AuthContext);
    // const { type, businessID } = route.params
    // console.log("Type: ", type, "& BusinessID: ", businessID)

    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [message, setMessage] = useState('')


    const createFeedback = async () => {
        console.log("Business ID: ", user.uid)
        setLoading(true)

        if (name !== "") {
            try {
                await firestore()
                    .collection('Feedback')
                    .add({
                        user_id: user.uid,
                        // name: name,
                        phoneNo: phoneNo,
                        message: message,
                        name: user.displayName,

                        timestamp: firestore.Timestamp.fromDate(new Date()),
                    })
                    .then(() => {
                        setLoading(false)
                        setName("")
                        setPhoneNo("")
                        setMessage("")
                        navigation.goBack();
                    })
            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        } else {
            Alert.alert(
                "Notice",
                "Please fill all fields first ..."
            )
            setLoading(false)
        }
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }} keyboardShouldPersistTaps='always'>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }

            {/* Header */}
            <View style={HeaderStyle.mainContainer}>
                <View style={HeaderStyle.arrowbox}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="left" color="#1A1E25" size={20} />
                    </TouchableOpacity>
                </View>
                <View style={HeaderStyle.HeaderTextContainer}>
                    <Text style={HeaderStyle.HeaderText}>Feedback</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: user.photoURL }} />
                </View>
            </View>

            <View style={{ width: '90%', alignSelf: 'center', flex: 1, marginTop: 10 }}>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textTitle, { marginTop: 20 }]}>
                        Name
                        <Text style={{ color: 'red' }}> *</Text>
                    </Text>
                </View>
                <TextInput
                    keyboardType='default'
                    style={styles.inputStyle}
                    placeholder=' Enter Name'
                    placeholderTextColor={"#A1A1A1"}
                    value={name}
                    onChangeText={(value) => setName(value)}
                />


                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textTitle, { marginTop: 20 }]}>
                        Phone No.
                        {/* <Text style={{ color: 'red' }}> *</Text> */}
                    </Text>
                </View>
                <TextInput
                    keyboardType='phone-pad'
                    style={styles.inputStyle}
                    placeholder=' Enter Phone No.'
                    placeholderTextColor={"#A1A1A1"}
                    value={phoneNo}
                    onChangeText={(value) => setPhoneNo(value)}
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textTitle, { marginTop: 20 }]}>
                        Message
                        {/* <Text style={{ color: 'red' }}> *</Text> */}
                    </Text>
                </View>

                <TextInput
                    keyboardType='default'
                    style={styles.inputStyleMessage}
                    multiline
                    numberOfLines={4}
                    placeholder=' Enter Message'
                    placeholderTextColor={"#A1A1A1"}
                    value={message}
                    onChangeText={(values) => setMessage(values)}
                />


                <View style={{ flex: 1, justifyContent: 'flex-end', }}>
                    <TouchableOpacity
                        onPress={() => createFeedback()}
                        style={styles.button}>
                        <Text style={styles.btnText}>Send Feedback</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    textHeading: {
        fontSize: 16,
        fontWeight: "400",
        color: '#000000'
    },
    textTitle: {
        fontSize: 14,
        fontWeight: "900",
        color: '#000000'
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
        fontWeight: "500"
    },
    
    inputStyleMessage: {
        width: "100%",
        textAlign: "left",
        borderBottomWidth: 1,
        borderColor: "#E2E2E2",
        color: "#000000",
        paddingLeft: 0,
        paddingBottom: 0,
        fontSize: 12,
        fontWeight: "500",
        textAlignVertical :'top'
    },
    button: {
        backgroundColor: "#917AFD",
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 12,
        // marginTop: 50,
    },
    btnText: {
        textAlign: 'center',
        color: 'white',
        margin: 15,
    }
})