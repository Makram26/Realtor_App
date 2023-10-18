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
    ScrollView,
    Dimensions,
    BackHandler
} from 'react-native';
import { WelcomeScreenStyles } from '../constants/Styles';
import { DrawerStyle } from '../constants/Styles';
import BottomTabNavigation from './BottomTabNavigation';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon3 from 'react-native-vector-icons/FontAwesome5'
import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import Spinner from 'react-native-loading-spinner-overlay';

import userApi from '../api/PermissionsAPIs/checkUserAPI'
import { AuthContext } from '../auth/AuthProvider'

export default function Drawer({ props }) {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);
    const [userImage, setUserImage] = useState(null)
    const [username, setUsername] = useState("")
    const [useremail, setUseremail] = useState("")

    const [checkEmployeeType, setCheckEmployeeType] = useState(false)
    const [loading, setLoading] = useState(false)

    const [subMenu, setSubMenu] = useState(false)
    const [subMenuTwo, setSubMenuTwo] = useState(false)
    const [stateCustomerInvoice, setStateCustomerInvoice] = useState(false)
    const [stateSupplierInvoice, setStateSupplierInvoice] = useState(false)

    console.log(user)

    useEffect(() => {
        // getUser()
        const unsubscribe = navigation.addListener('focus', () => {
            getUser()
        });

        return () => {
            unsubscribe;
        };

    }, [])
    // useEffect(() => {
    //     getUser()

    // }, [])

    const getUser = async () => {
        setLoading(true)
        const response = await userApi.checkUserType(user.uid)
        console.log("respone", response)
        if (response && response == 1) {
            setCheckEmployeeType(true)
            setLoading(false)
        }
        else {
            setCheckEmployeeType(false)
            setLoading(false)
        }

    }

    const OpenSubMenu = () => {
        // setAnswer(true)
        setSubMenu(!subMenu)
    }

    const OpenSubMenuTwo = (id) => {
        if (id == 1) {
            setStateCustomerInvoice(true);
            setStateSupplierInvoice(false);
            setStateCustomerInvoice(!stateCustomerInvoice)
            // setSubMenuTwo(!subMenuTwo)
        }
        if (id == 2) {
            setStateCustomerInvoice(false);
            setStateSupplierInvoice(true);
            setStateSupplierInvoice(!stateSupplierInvoice)
            // setSubMenuTwo(!subMenuTwo)
        }
    }


    const onSignOut = async () => {
        try {
            await auth().signOut()
        } catch (e) {
            console.error(e)
        }
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            // this.setState({ user: null }); // Remember to remove the user from your app's state as well
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <ScrollView style={DrawerStyle.mainContainer}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <View style={{ flex: 1, margin: 15 }}>
                <View style={DrawerStyle.iconContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <Icon1 name="navicon" color="#000000" size={40} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={DrawerStyle.userDetailsContainer}>
                <Image
                    source={{ uri: user.photoURL }}
                    style={{ width: 80, height: 80, borderRadius: 100 }}
                    resizeMode="contain"
                />
                {/* {
                    userImage ?
                    <Image
                    source={{ uri: userImage }}
                    style={{ width: 80, height: 80,borderRadius:100 }}
                    resizeMode="contain"                  
                />
                    :
                    <Image style={{ width: 80, height: 80 }}
                    source={require('../assets/images/personpic.png')}
                    resizeMode='contain' />

                } */}

                <Text style={DrawerStyle.username}>{user.displayName}</Text>
                <Text style={DrawerStyle.usermail}>{user.email}</Text>
            </View>
            <View style={{ alignSelf: 'center', borderWidth: 0.6, borderColor: "#D6D6D6", width: "95%", marginTop: 10 }} />
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', margin: 15, marginTop: 30 }} onPress={() => navigation.navigate("UserProfile")}>
                <View style={DrawerStyle.iconStyle}>
                    <Icon name="person" color="#1A1E25" size={20} />
                </View>
                <View style={DrawerStyle.DrawerDataContainer}>
                    <Text style={DrawerStyle.textStyle}>My Profile</Text>
                    <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                </View>
            </TouchableOpacity>

            {
                checkEmployeeType ? null :
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', margin: 15 }} onPress={() => navigation.navigate("UsersSetting")}>
                        <View style={DrawerStyle.iconStyle}>
                            <Image source={require('../assets/icons/users.png')} />
                        </View>
                        <View
                            style={{ flex: 0.9, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10, alignItems: 'center' }}
                        >
                            <Text style={DrawerStyle.textStyle}>Users</Text>
                            <View>
                                <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                            </View>
                        </View>
                    </TouchableOpacity>
            }

            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', margin: 15 }} onPress={() => navigation.navigate("Deal")}>
                <View style={DrawerStyle.iconStyle}>
                    <Image source={require('../assets/icons/deals.png')} />
                </View>
                <View style={DrawerStyle.DrawerDataContainer}>
                    <Text style={DrawerStyle.textStyle}>Deals</Text>
                    <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', margin: 15 }} onPress={() => navigation.navigate("AddBulkInventory")}>
                <View style={DrawerStyle.iconStyle}>
                <Icon2 name="inventory" color="#000000" size={20} />
                </View>
                <View style={DrawerStyle.DrawerDataContainer}>
                    <Text style={DrawerStyle.textStyle}>Add Bulk Inventory</Text>
                    <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', margin: 15 }} onPress={() => OpenSubMenu(true)}>
                <View style={DrawerStyle.iconStyle}>
                    <Image source={require("../assets/icons/AccountIcon.png")} />
                </View>
                <View style={DrawerStyle.DrawerDataContainer}>
                    <Text style={DrawerStyle.textStyle}>Accounts</Text>
                    {
                        subMenu ?
                            <Icon1 name="chevron-up" color="#7D7F88" size={40} />
                            :
                            <Icon1 name="chevron-down" color="#7D7F88" size={40} />
                    }
                </View>
            </TouchableOpacity>

            {
                subMenu ?
                    <>
                        <TouchableOpacity style={{ flex: 0.7, flexDirection: 'row', margin: 15, marginLeft: 50 }} onPress={() => OpenSubMenuTwo(1)}>
                            <View style={{ flex: 0.1, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Image source={require("../assets/icons/AccountIcon.png")} /> */}
                            </View>
                            <View style={DrawerStyle.DrawerDataContainer}>
                                <Text style={DrawerStyle.textStyle}>Customer</Text>
                                {
                                    stateCustomerInvoice ?
                                        <Icon1 name="chevron-up" color="#7D7F88" size={40} />
                                        :
                                        <Icon1 name="chevron-down" color="#7D7F88" size={40} />
                                }
                            </View>
                        </TouchableOpacity>

                        {
                            stateCustomerInvoice ?
                                <>
                                    <TouchableOpacity style={{ flex: 0.7, flexDirection: 'row', margin: 15, marginLeft: 100 }} onPress={() => navigation.navigate("Invoices")}>
                                        <View style={{ flex: 0.1, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                                            {/* <Image source={require("../assets/icons/AccountIcon.png")} /> */}
                                        </View>
                                        <View style={DrawerStyle.DrawerDataContainer}>
                                            <Text style={DrawerStyle.textStyle}> Invoice </Text>
                                            <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 0.7, flexDirection: 'row', margin: 15, marginLeft: 100 }} onPress={()=> navigation.navigate("PaymentsRecord", {"invoiceType" : "Customer"})}>
                                        <View style={{ flex: 0.1, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                                            {/* <Image source={require("../assets/icons/AccountIcon.png")} /> */}
                                        </View>
                                        <View style={DrawerStyle.DrawerDataContainer}>
                                            <Text style={DrawerStyle.textStyle}> Payments </Text>
                                            <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 0.7, flexDirection: 'row', margin: 15, marginLeft: 100 }} onPress={() => navigation.navigate("Customers")}>
                                        <View style={{ flex: 0.1, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                                            {/* <Image source={require("../assets/icons/AccountIcon.png")} /> */}
                                        </View>
                                        <View style={DrawerStyle.DrawerDataContainer}>
                                            <Text style={DrawerStyle.textStyle}> Customers </Text>
                                            <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                                        </View>
                                    </TouchableOpacity>

                                </>
                                :
                                null
                        }

                        {/* Supplier */}
                        <TouchableOpacity style={{ flex: 0.7, flexDirection: 'row', margin: 15, marginLeft: 50 }} onPress={() => OpenSubMenuTwo(2)}>
                            <View style={{ flex: 0.1, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                                {/* <Image source={require("../assets/icons/AccountIcon.png")} /> */}
                            </View>
                            <View style={DrawerStyle.DrawerDataContainer}>
                                <Text style={DrawerStyle.textStyle}>Supplier</Text>
                                {
                                    stateSupplierInvoice ?
                                        <Icon1 name="chevron-up" color="#7D7F88" size={40} />
                                        :
                                        <Icon1 name="chevron-down" color="#7D7F88" size={40} />
                                }
                            </View>
                        </TouchableOpacity>

                        {
                            stateSupplierInvoice ?
                                <>
                                    <TouchableOpacity style={{ flex: 0.7, flexDirection: 'row', margin: 15, marginLeft: 100 }} onPress={() => navigation.navigate("SupplierInvoices")}>
                                        <View style={{ flex: 0.1, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                                            {/* <Image source={require("../assets/icons/AccountIcon.png")} /> */}
                                        </View>
                                        <View style={DrawerStyle.DrawerDataContainer}>
                                            <Text style={DrawerStyle.textStyle}> Invoice </Text>
                                            <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 0.7, flexDirection: 'row', margin: 15, marginLeft: 100 }} onPress={()=> navigation.navigate("PaymentsRecord", {"invoiceType" : "Supplier"})}>
                                        <View style={{ flex: 0.1, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                                            {/* <Image source={require("../assets/icons/AccountIcon.png")} /> */}
                                        </View>
                                        <View style={DrawerStyle.DrawerDataContainer}>
                                            <Text style={DrawerStyle.textStyle}> Payments </Text>
                                            <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 0.7, flexDirection: 'row', margin: 15, marginLeft: 100 }} onPress={() => navigation.navigate("Suppliers")}>
                                        <View style={{ flex: 0.1, height: 40, width: 40, justifyContent: 'center', alignItems: 'center' }}>
                                            {/* <Image source={require("../assets/icons/AccountIcon.png")} /> */}
                                        </View>
                                        <View style={DrawerStyle.DrawerDataContainer}>
                                            <Text style={DrawerStyle.textStyle}> Suppliers </Text>
                                            <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                                        </View>
                                    </TouchableOpacity>
                                </>
                                :
                                null
                        }

                    </>
                    :
                    null
            }

            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', margin: 15 }} onPress={() => navigation.navigate("FAQ")}>
                <View style={DrawerStyle.iconStyle}>
                    <Image source={require('../assets/icons/contacts.png')} />
                </View>
                <View style={DrawerStyle.DrawerDataContainer}>
                    <Text style={DrawerStyle.textStyle}>Contacts</Text>
                    <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', margin: 15 }} onPress={() => navigation.navigate("AccountIntegrate")}>
                <View style={DrawerStyle.iconStyle}>
                    <Image source={require('../assets/icons/contacts.png')} />
                </View>
                <View style={DrawerStyle.DrawerDataContainer}>
                    <Text style={DrawerStyle.textStyle}>Accounting Integration</Text>
                    <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                </View>
            </TouchableOpacity>

            {/* <TouchableOpacity style={{ flex: 1, flexDirection: 'row', margin: 15 }} onPress={() => navigation.navigate("Feedback")}>
                <View style={DrawerStyle.iconStyle}>
                    <Icon2 name="feedback" size={20} color={"#000"} />
                </View>
                <View style={DrawerStyle.DrawerDataContainer}>
                    <Text style={DrawerStyle.textStyle}>Feedback</Text>
                    <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                </View>
            </TouchableOpacity> */}

            <View style={{ borderWidth: 0.6, borderColor: "#D6D6D6", marginTop: 20, marginBottom: 5 }} />
            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', margin: 15, marginTop: 30 }} onPress={() => onSignOut()}>
                <View style={DrawerStyle.iconStyle}>
                    <Icon2 name="logout" color="#1A1E25" size={20} />
                </View>
                <View style={DrawerStyle.DrawerDataContainer}>
                    <Text style={DrawerStyle.textStyle}>Log Out</Text>
                    <TouchableOpacity >
                        <Icon1 name="chevron-right" color="#7D7F88" size={40} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </ScrollView>
    );
}
