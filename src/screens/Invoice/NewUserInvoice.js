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
import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider';
import firestore from '@react-native-firebase/firestore'
import Spinner from 'react-native-loading-spinner-overlay';
import { shortenAddress } from '../../functions/shortenAddress';
import Customers from './Customers';

export default function NewUserInvoice({ route, navigation }) {
    const { user } = useContext(AuthContext);
    const { type, businessID, status, invoicersName, } = route.params
    console.log("Type: ", type, "& BusinessID: ", businessID, "& status", status, "&& invoicersName", invoicersName,)

    const [loading, setLoading] = useState(false)
    const [invoicerName, setInvoicerName] = useState('')
    const [phoneNo, setPhoneNo] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')


    const createCustomer = async () => {
        console.log("Business ID: ", user.uid)
        setLoading(true)

        if (invoicerName !== "" || invoicersName !== undefined) {
            try {
                await firestore()
                    .collection('InvoiceUser')
                    .add({
                        user_id: user.uid,
                        invoicerName: invoicerName !== "" ? invoicerName : invoicersName,
                        phoneNo: phoneNo,
                        email: email,
                        address: address,
                        status: status,

                        businessID: type == "own" ? businessID : user.uid,
                        role: type,
                        name: user.displayName,

                        timestamp: firestore.Timestamp.fromDate(new Date()),
                    })
                    .then(() => {
                        // Alert.alert(
                        //     "Deal Done",
                        //     //"Image and Data has been uploaded successfully!"
                        // )
                        setLoading(false)
                        setInvoicerName("")
                        setPhoneNo("")
                        setEmail("")
                        setAddress("")
                        navigation.goBack();
                        // if (status === "Customer") {
                        //     navigation.navigate('Customers')
                        // }
                        // else {
                        //     navigation.navigate('Suppliers')
                        // }
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
                    {
                        status == "Customer" ?
                            <Text style={HeaderStyle.HeaderText}>Create Customer</Text>
                            :
                            <Text style={HeaderStyle.HeaderText}>Create Supplier</Text>

                    }

                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: user.photoURL }} />
                </View>
            </View>

            <View style={{ width: '90%', alignSelf: 'center', flex: 1, marginTop: 10 }}>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                    {
                        status == "Customer" ?
                            <Text style={[styles.textTitle, { marginTop: 20 }]}>
                                Customer Name
                                <Text style={{ color: 'red' }}> *</Text>
                            </Text>
                            :
                            <Text style={[styles.textTitle, { marginTop: 20 }]}>
                                Supplier Name
                                <Text style={{ color: 'red' }}> *</Text>
                            </Text>
                    }
                </View>

                {
                    invoicersName ?
                        <Text style={[styles.inputStyle, { marginTop: 10 }]}>{invoicersName}</Text>
                        :
                        <TextInput
                            keyboardType='default'
                            style={styles.inputStyle}
                            placeholder='Enter Name'
                            placeholderTextColor={"#A1A1A1"}
                            value={invoicerName}
                            onChangeText={(value) => setInvoicerName(value)}
                        />
                }

                {/* <TextInput
                    keyboardType='default'
                    style={styles.inputStyle}
                    placeholder=' Enter Name'
                    placeholderTextColor={"#A1A1A1"}
                    value={invoicerName}
                    onChangeText={(value) => setInvoicerName(value)}
                /> */}


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
                        Email
                        {/* <Text style={{ color: 'red' }}> *</Text> */}
                    </Text>
                </View>

                <TextInput
                    keyboardType='email-address'
                    style={styles.inputStyle}
                    placeholder=' Enter Email'
                    placeholderTextColor={"#A1A1A1"}
                    value={email}
                    onChangeText={(values) => setEmail(values)}
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textTitle, { marginTop: 20 }]}>
                        Address
                        {/* <Text style={{ color: 'red' }}> *</Text> */}
                    </Text>
                </View>

                <TextInput
                    keyboardType='default'
                    style={styles.inputStyle}
                    placeholder=' Enter Address'
                    placeholderTextColor={"#A1A1A1"}
                    value={address}
                    onChangeText={(values) => setAddress(values)}
                />

                <View style={{ flex: 1, justifyContent: 'flex-end', }}>
                    <TouchableOpacity
                        onPress={() => createCustomer()}
                        style={styles.button}>
                        {
                            status == "Customer" ?
                                <Text style={styles.btnText}>Create Customer</Text>
                                :
                                <Text style={styles.btnText}>Create Supplier</Text>
                        }

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