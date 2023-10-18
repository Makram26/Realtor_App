import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Modal,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Dimensions,
    BackHandler,
    FlatList,
    RefreshControl
} from 'react-native';

import firestore from '@react-native-firebase/firestore'
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage'
import CheckBox from '@react-native-community/checkbox';
import { MaskedTextInput } from "react-native-mask-text";

import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/Entypo';
import Person from 'react-native-vector-icons/Ionicons'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'

import { HeaderStyle } from '../constants/Styles'
import { AuthContext } from '../auth/AuthProvider'

import UserCard from '../components/UserCard';
import UserApi from '../api/UserSettingAPIs/UserSettingsAPI'
import MyApi from '../api/UserAPI'


const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const NAME_REGEX = /^[a-zA-Z\s]*$/

const ROLE = {
    OWN: 'own',
    BUSINESS: 'business'
}

const NUMBER_OF_FREE_USERS = 0;

export default function UsersSetting({ navigation }) {

    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(false)

    const [userData, setUserData] = useState([])
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [payment_status, setPayment_Status] = useState(false)

    // Create User CheckBoxes and states
    const [toggleCheckBox1, setToggleCheckBox1] = useState(true)
    const [toggleCheckBox2, setToggleCheckBox2] = useState(false)
    const [createUserModal, setCreateUserModal] = useState(false)

    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')

    const [cityName, setCityName] = useState()
    const [cityID, setCityID] = useState()

    const [countryName, setCountryName] = useState()
    const [countryID, setCountryID] = useState()

    const [search, setSearch] = useState('')

    const [editUserModal, setEditUserModal] = useState(false)
    const [disableUserModal, setDisableUserModal] = useState(false)
    const [paymentModal, setPaymentModal] = useState(false)

    const [editData, setEditData] = useState()
    const [disableUserData, setDisableUserData] = useState()

    const [editToggleCheckBox1, setEditToggleCheckBox1] = useState(false)
    const [editToggleCheckBox2, setEditToggleCheckBox2] = useState(false)

    // bool for editable texts
    const [showName, setShowName] = useState(false)
    const [showContact, setShowContact] = useState(false)

    // state for editable fields
    const [editName, setEditName] = useState('')
    const [editContact, setEditContact] = useState('')

    // Input for total Users
    const [inputUsers, setInputUsers] = useState(1)

    const [totalUsers, setTotalUsers] = useState()
    const [totalSubscriptions, setTotalSubscriptions] = useState(0)

    // console.log("editData", editData)
    // console.log("user===>>", user.providerData)

    // Catagory Type
    const [btnColorResidentiol, setBtnColorResidentiol] = useState(true)
    const [btnColorComercial, setBtnColorComercial] = useState(false)
    const [btnColorSemiComercial, setBtnColorSemiComercial] = useState(false)

    // Property States
    const [houseProperty, setHouseProperty] = useState(true)
    const [flatProperty, setFlatProperty] = useState(false)
    const [farmHouseProperty, setFarmHouseProperty] = useState(false)
    const [pentHouseProperty, setPentHouseProperty] = useState(false)

    const [officeProperty, setOfficeProperty] = useState(false)
    const [shopProperty, setShopProperty] = useState(false)
    const [buildingProperty, setBuildingProperty] = useState(false)
    const [factoryProperty, setFactoryProperty] = useState(false)

    const [housesProperty, setHousesProperty] = useState(false)
    const [plotsProperty, setPlotsProperty] = useState(false)
    const [shopsProperty, setShopsProperty] = useState(false)
    const [officesProperty, setOfficesProperty] = useState(false)
    const [agricultureProperty, setAgrecultureProperty] = useState(false)
    const [farmHousesProperty, setFarmHousesProperty] = useState(false)
    const [pentHopusesProperty, setPentHousesProperty] = useState(false)
    const [buildingsProperty, setBuildingsProperty] = useState(false)
    const [flatsProperty, setFlatsProperty] = useState(false)
    const [files, setFiles] = useState(false)

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])


    useEffect(() => {
        loadUserList()
        const unsubscribe = navigation.addListener('focus', () => {
            loadUserList()
        });

        return () => {
            unsubscribe;
        };
    }, [])



    // console.log("backendMobileNumber===>>>>", password)

    const loadUserList = async () => {
        setUserData([]);
        setFilteredDataSource([])
        setLoading(true)

        const userID = user.uid
        const response = await UserApi.getUsers(userID);
        const res = await UserApi.getPaymentStatus(user.uid);
        setTotalSubscriptions(res)
        // console.log("userList", response)
        if (response && response.length > 0) {
            setUserData(response)
            // setPayment_Status(res)
            setTotalUsers(response.length)
            setFilteredDataSource(response)
            // setTotalProperties(response.length)
            setLoading(false)
        }
        else {
            setLoading(false)
            // setPayment_Status(true)
        }
    }

    useEffect(() => {
        getID()
    }, [])

    // var cityName

    const getID = async () => {
        var city = await AsyncStorage.getItem("@city");
        var cityID = await AsyncStorage.getItem("@cityID");
        var country = await AsyncStorage.getItem("@country");
        var countryID = await AsyncStorage.getItem("@countryID");
        // console.log(city)
        setCityName(city)
        setCityID(cityID)
        setCountryName(country)
        setCountryID(countryID)
    }

    const checkEmailHandler = async (email) => {
        setLoading(true)
        const users = await UserApi.getAdmins(user.uid)
        if (users && users.length > 0) {
            users.map((item) => {
                if (item.email == email) {
                    setLoading(false)
                    Alert.alert("This email already exists")
                    return true
                }
                // } else {
                //     addUserHandler()
                //     // setLoading(false)
                //     // return false
                // }
            })
            addUserHandler()
        }
    }

    // Categoty State
    const CategoryHandler = (id) => {
        // console.log("id :", id)
        switch (id) {
            case 1:
                setBtnColorResidentiol(true)
                setBtnColorComercial(false)
                setBtnColorSemiComercial(false)
                break;
            case 2:
                setBtnColorResidentiol(false)
                setBtnColorComercial(true)
                setBtnColorSemiComercial(false)
                break;
            case 3:
                setBtnColorResidentiol(false)
                setBtnColorComercial(false)
                setBtnColorSemiComercial(true)
                break;
            default:
                break;
        }
    }

    // Property Type State
    const changePropertyHandler = (id) => {
        // console.log("id", id)
        switch (id) {
            case 1:
                setHouseProperty(true)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 2:
                setHouseProperty(false)
                setFlatProperty(true)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 3:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(true)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 4:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(true)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;

            case 5:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(true)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;

            case 6:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(true)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;

            case 7:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(true)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;

            case 8:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(true)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;


            case 9:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(true)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 10:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(true)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 11:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(true)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 12:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(true)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 13:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(true)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 14:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(true)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 15:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(true)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(false)
                break;
            case 16:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(true)
                setFlatsProperty(false)
                setFiles(false)
                break;

            case 17:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(true)
                setFiles(false)
                break;
            case 18:
                setHouseProperty(false)
                setFlatProperty(false)
                setFarmHouseProperty(false)
                setPentHouseProperty(false)

                setOfficeProperty(false)
                setShopProperty(false)
                setBuildingProperty(false)
                setFactoryProperty(false)

                setHousesProperty(false)
                setPlotsProperty(false)
                setShopsProperty(false)
                setOfficesProperty(false)
                setAgrecultureProperty(false)
                setFarmHousesProperty(false)
                setPentHousesProperty(false)
                setBuildingsProperty(false)
                setFlatsProperty(false)
                setFiles(true)
                // setSaleType(true)
                // setLetType(false)
                break;
        }
    }


    const addUserHandler = async () => {
        setLoading(true)
        const res = await MyApi.getUsers(user.uid);

        if (res == mobileNumber) {
            Alert.alert("You cannot create user having same Phone Number")
            setLoading(false)
            return true
        }

        if (user.email == number) {
            Alert.alert("You cannot create user having same email")
            setLoading(false)
            return true
        }

        if (name) {
            if (!NAME_REGEX.test(name)) {
                Alert.alert("Name can only only create alphabets")
                setLoading(false)
                return true
            }
        }


        // if(name == user.displayName){
        //     Alert.alert("You cannot create user having same name")
        //     return true
        // }

        // if(name && number && mobileNumber && mobileNumber.length >= 12) {
        if (name && number && mobileNumber) {
            if (EMAIL_REGEX.test(number)) {
                // setLoading(true)
                try {
                    // setLoading(true)
                    firestore()
                        .collection('UserSettings')
                        .add({
                            user_id: user.uid,
                            name: name,
                            email: number,
                            mobile: mobileNumber,
                            // catagory: btnColorResidentiol ? 'Residential' : btnColorComercial ? 'Commercial' : 'Semi Commercial',
                            // propertyType: houseProperty ? 'House' : flatProperty ? 'Flat' : farmHouseProperty ? 'Farm House' : pentHouseProperty ? 'Pent House' : officeProperty ? 'Office' : shopProperty ? 'Shop' : buildingProperty ? 'Building' : factoryProperty ? 'Factory' : housesProperty ? 'House' : plotsProperty ? 'Plot' : shopsProperty ? 'Shop' : officesProperty ? 'Office' : agricultureProperty ? 'Agriculture' : farmHousesProperty ? 'Farm House' : pentHopusesProperty ? 'Pent House' : buildingsProperty ? 'Building' : files ? 'Files' : 'Flat',
                            role: toggleCheckBox1 ? ROLE.OWN : toggleCheckBox2 ? ROLE.BUSINESS : null,
                            city: cityName,
                            cityID: cityID,
                            country: "Pakistan",
                            countryID: 1,
                            businessID: user.uid,
                            status: "Active",
                            timestamp: firestore.Timestamp.fromDate(new Date())
                        })
                        .then(() => {
                            setLoading(false)
                            setName('')
                            setNumber('')
                            setCreateUserModal(!createUserModal)
                            loadUserList()
                            Alert.alert("User created successfully")
                            // navigation.goBack()
                        })

                } catch (err) {
                    console.log(err)
                    setLoading(false)
                }
            } else {
                Alert.alert("Enter correct email")
                setLoading(false)
            }
        } else {
            Alert.alert("Please fill all fields")
            setLoading(false)
        }
    }

    const updateUserHandler = async () => {
        setLoading(true)
        if (editName) {
            if (!NAME_REGEX.test(editName)) {
                Alert.alert("Name should have alphabets only")
                return true
            }
        }
        if (editContact && editContact.length < 12) {
            Alert.alert("Mobile number should be 12 characters long")
            return true
        }

        try {
            await firestore()
                .collection('UserSettings')
                .doc(editData?.id)
                .update({
                    name: editName !== "" ? editName : editData?.name,
                    mobile: editContact !== "" ? editContact : editData?.contact,
                    role: editToggleCheckBox1 ? ROLE.OWN : editToggleCheckBox2 ? ROLE.BUSINESS : null,
                })
                .then(() => {
                    setLoading(false)
                    setEditUserModal(false)
                    Alert.alert("User updated successfully")
                    loadUserList()
                })
        } catch (error) {
            console.log(err)
            setLoading(false)
        }
    }

    const searchUsersFilter = (text) => {
        if (text) {
            const newData = userData.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredDataSource(newData)
            setSearch(text)
        } else {
            setFilteredDataSource(userData)
            setSearch(text)
        }
    }

    const paymentModalHandler = async () => {
        const res = await UserApi.getPaymentStatus(user.uid);
        const totalUers = await UserApi.getTotalUsers(user.uid)
        console.log("res at payment handler", res)
        console.log("total users at payment handler", totalUers)
        if (res >= 1) {
            if (totalUers == res) {
                Alert.alert(
                    "New Users will be charged at $2.50 per user per month.",
                    "Are you sure you want to continue?",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel"
                        },
                        { text: "OK", onPress: () => setPaymentModal(!paymentModal) }
                    ]
                )
            } else {
                setCreateUserModal(!createUserModal)
            }
        } else {
            Alert.alert(
                "New Users will be charged at $2.50 per user per month.",
                "Are you sure you want to continue?",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => setPaymentModal(!paymentModal) }
                ]
            )
        }
    }

    const updateUserTotal = async (total) => {
        console.log("total", total)
        setLoading(true)
        const res = await UserApi.getPaymentStatus(user.uid);
        // console.log(res[0].payment_status)
        console.log("totalUsers", typeof res)
        try {
            await firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    totaUsers: res + total
                })
                .then(() => {
                    navigation.navigate("payment", total)
                    setLoading(false)
                    setPaymentModal(false)
                    setInputUsers(1)
                })

        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    const PaymentMethod = () => {

        if (payment_status == true) {
            setCreateUserModal(!createUserModal)
        }
        else {
            Alert.alert(
                "Alert",
                "Your free trial has expired.To create another user you need to enter payment info",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => navigation.navigate("payment") }
                ]
            );

        }
    }

    const changeReadHandler = (text, type) => {
        if (text == "Read") {
            if (type) {
                setToggleCheckBox1(true)
                setToggleCheckBox2(false)
            }
        } else {
            if (type) {
                setToggleCheckBox2(true)
                setToggleCheckBox1(false)
            }
        }
    }

    const changeEditHandler = (text, type) => {
        if (text == "Read") {
            if (type) {
                setEditToggleCheckBox1(true)
                setEditToggleCheckBox2(false)
            }
        } else {
            if (type) {
                setEditToggleCheckBox2(true)
                setEditToggleCheckBox1(false)
            }
        }
    }

    // console.log("toggleCheckBox1>>>",toggleCheckBox1)

    const updateModalHandler = (item) => {
        // console.log("updateItem=>>>>>>", item)
        setEditData(item)
        setEditUserModal(true)
        setEditToggleCheckBox1(item.role == "own" ? true : false)
        setEditToggleCheckBox2(item.role == "business" ? true : false)
    }

    const disableModalHandler = (item) => {
        setDisableUserModal(true)
        setDisableUserData(item)
    }

    // console.log("Disable Data", disableUserData)

    const disableUserHandler = async () => {
        setLoading(true)
        try {
            await firestore()
                .collection('UserSettings')
                .doc(disableUserData?.id)
                .update({
                    status: disableUserData?.status == "Active" ? "Disable" : "Active"
                })
                .then(() => {
                    setLoading(false)
                    setDisableUserModal(false)
                    Alert.alert("Status changed successfully")
                    loadUserList()
                })
        } catch (error) {
            console.log(err)
            setLoading(false)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <View style={HeaderStyle.mainContainer}>
                <View style={HeaderStyle.arrowbox}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="left" color="#1A1E25" size={20} />
                    </TouchableOpacity>
                </View>
                <View style={HeaderStyle.HeaderTextContainer}>
                    <Text style={HeaderStyle.HeaderText}>Users</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: user.photoURL }} />
                </View>
            </View>
            <View style={HeaderStyle.searchContainer}>
                <Icon1 name="search" color="#1A1E25" size={30} style={{ marginLeft: 10 }} />
                <TextInput style={HeaderStyle.searchText}
                    placeholder='Search user here..'
                    placeholderTextColor={"#7D7F88"}
                    value={search}
                    onChangeText={(text) => searchUsersFilter(text)}
                />
            </View>

            <View style={styles.btnContianer}>
                <Text style={{ color: '#696969', fontSize: 15, fontWeight: '600', alignItems: 'center' }}>Total Subscriptions:
                    <Text style={{ color: '#696969', fontSize: 15, fontWeight: '800' }}> {totalSubscriptions}</Text>
                </Text>

                <TouchableOpacity onPress={() => paymentModalHandler()}
                    style={styles.btnStyle}>
                    <Text style={styles.btnText}>New User</Text>
                </TouchableOpacity>
            </View>




            <View style={styles.underline} />
            {
                filteredDataSource.length < 1 ?
                    <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
                        <Text style={{
                            color: '#8A73FB',
                            marginBottom: 5,
                            fontSize: 25,
                            fontWeight: 'bold'
                        }}>You do not have any User!</Text>
                    </View>
                    :
                    null
            }
            <FlatList
                data={filteredDataSource}
                keyExtractor={(stock) => stock.id}
                renderItem={({ item, index }) => {
                    // if (item.transactionType == 'Let') {
                    return (
                        <UserCard
                            name={item.name}
                            contact={item.contact}
                            onPress={() => updateModalHandler(item)}
                            disable={() => disableModalHandler(item)}
                            type={item.status}
                        />
                    )
                    // }
                }}
                refreshControl={<RefreshControl refreshing={false} onRefresh={loadUserList} />}
            />
            {/* {filteredDataSource.map((item, index) => {
                return (
                    <UserCard
                        name={item.name}
                        contact={item.contact}
                        onPress={() => updateModalHandler(item)}
                        disable={() => disableModalHandler(item)}
                        type={item.status}
                    />
                ) */}
            {/* })} */}

            {/* Create Modal */}
            <View style={{ flex: 1 }}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={createUserModal}
                    onRequestClose={() => {
                        setCreateUserModal(!createUserModal);
                    }}
                >
                    <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "flex-end",
                    }}>
                        <View style={{ backgroundColor: 'gray', opacity: 0.5, flex: 0.9 }}></View>
                        <View style={{ flex: 0.1, backgroundColor: '#ccc' }}>
                            <View style={{
                                flex: 1,
                                backgroundColor: '#fbfcfa',
                                borderTopLeftRadius: 50,
                                borderTopRightRadius: 50,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 20,
                            }}>

                                <View style={{ flex: 0.5, margin: 15, }}>
                                    <View style={{ flex: 0.2, flexDirection: 'row-reverse', marginBottom: -30 }}>
                                        <TouchableOpacity style={{ marginRight: 20 }}
                                            onPress={() => setCreateUserModal(!createUserModal)}>
                                            <Icon2 name="cross" color="#A1A1A1" size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 0.8, }}>
                                        <View style={{ alignItems: 'center' }}>
                                            {/* <Image style={{ width: 69, height: 69, }} resizeMode='stretch' source={require('../assets/images/personpic.png')} /> */}
                                            <Person name="md-person-circle-sharp"
                                                size={90} color="#282B4E"
                                            // style={styles.sellerImage}
                                            />
                                        </View>
                                        <Text style={{ marginTop: 15, color: "#000000", fontSize: 14, fontWeight: "900" }}>Full Name</Text>
                                        <TextInput
                                            style={{ width: "99%", borderBottomWidth: 1, borderColor: "#E2E2E2", padding: 0, fontSize: 12, fontWeight: "500" }}
                                            placeholder='Enter Name'
                                            placeholderTextColor={"#A1A1A1"}
                                            value={name}
                                            onChangeText={(value) => setName(value)}
                                        />

                                        <Text style={{ marginTop: 15, color: "#000000", fontSize: 14, fontWeight: "900" }}>Email Address</Text>
                                        <TextInput
                                            style={{ width: "99%", borderBottomWidth: 1, borderColor: "#E2E2E2", padding: 0, fontSize: 12, fontWeight: "500" }}
                                            placeholder="Enter Email"
                                            keyboardType="email-address"
                                            value={number}
                                            onChangeText={(value) => setNumber(value)}
                                        />

                                        <Text style={{ marginTop: 15, color: "#000000", fontSize: 14, fontWeight: "900" }}>Mobile</Text>
                                        <MaskedTextInput
                                            placeholder='Enter Mobile Number'
                                            style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", fontSize: 12, padding: 0 }}
                                            type="custom"
                                            mask="0399-9999999"
                                            value={mobileNumber}
                                            keyboardType="phone-pad"
                                            onChangeText={(text) => setMobileNumber(text)}
                                            // onChangeText={(text) => validateMobileNumber(text)}
                                            placeholderTextColor="#676767"
                                        />

                                        {/* <Text style={{ marginTop: 15, color: "#000000", fontSize: 14, fontWeight: "900" }}>Password</Text>
                                        <TextInput
                                            style={{ width: "99%", borderBottomWidth: 1, borderColor: "#E2E2E2", padding: 0, fontSize: 12, fontWeight: "500" }}
                                            placeholder="Enter Password"
                                            value={password}
                                            onChangeText={(value) => setPassword(value)}
                                        /> */}
                                    </View>
                                </View>

                            
                                {/* Catagory Type */}
                                {/* <Text style={styles.heading}>Category</Text>
                                <View style={propertyStyles.containerCatagory}>
                                    <TouchableOpacity onPress={() => CategoryHandler(1)}
                                        style={[propertyStyles.typeContainercatagory, { backgroundColor: btnColorResidentiol ? '#826AF7' : '#F2F2F3' }]}>
                                        <Text style={[propertyStyles.typecategory, { color: btnColorResidentiol ? '#FFFFFF' : '#7D7F88', }]}>Residential</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => CategoryHandler(2)}
                                        style={[propertyStyles.typeContainercatagory, { backgroundColor: btnColorComercial ? '#826AF7' : '#F2F2F3' }]}>
                                        <Text style={[propertyStyles.typecategory, { color: btnColorComercial ? '#FFFFFF' : '#7D7F88', }]}>Commercial</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => CategoryHandler(3)}
                                        style={[propertyStyles.typeContainercatagory, { backgroundColor: btnColorSemiComercial ? '#826AF7' : '#F2F2F3' }]}>
                                        <Text style={[propertyStyles.typecategory, { color: btnColorSemiComercial ? '#FFFFFF' : '#7D7F88', }]}>Semi Commercial</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                                
                                <Text style={styles.heading}>
                                    Property type
                                </Text>
                                {
                                    btnColorResidentiol == true && btnColorComercial == false && btnColorSemiComercial == false ?
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            contentContainerStyle={propertyStyles.container}>
                                            <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                                <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: houseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(1)}>
                                                <Text style={[propertyStyles.type, { color: houseProperty ? 'white' : '#7D7F88' }]}>House</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: flatProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(2)}>
                                                <Text style={[propertyStyles.type, { color: flatProperty ? 'white' : '#7D7F88' }]}>Apartment</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: files ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(18)}>
                                                <Text style={[propertyStyles.type, { color: files ? 'white' : '#7D7F88' }]}>Files</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: farmHouseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(3)}>
                                                <Text style={[propertyStyles.type, { color: farmHouseProperty ? 'white' : '#7D7F88' }]}>Farm House</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: pentHouseProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(4)}>
                                                <Text style={[propertyStyles.type, { color: pentHouseProperty ? 'white' : '#7D7F88' }]}>Pent House</Text>
                                            </TouchableOpacity>

                                        </ScrollView>
                                        :
                                        btnColorComercial === true && btnColorResidentiol == false && btnColorSemiComercial == false ?
                                            <ScrollView
                                                horizontal={true}
                                                showsHorizontalScrollIndicator={false}
                                                contentContainerStyle={propertyStyles.container}>
                                                <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                                    <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: officeProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(5)}>
                                                    <Text style={[propertyStyles.type, { color: officeProperty ? 'white' : '#7D7F88' }]}>Office</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: shopProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(6)}>
                                                    <Text style={[propertyStyles.type, { color: shopProperty ? 'white' : '#7D7F88' }]}>Shop</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: files ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(18)}>
                                                    <Text style={[propertyStyles.type, { color: files ? 'white' : '#7D7F88' }]}>Files</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: buildingProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(7)}>
                                                    <Text style={[propertyStyles.type, { color: buildingProperty ? 'white' : '#7D7F88' }]}>Building</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: factoryProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(8)}>
                                                    <Text style={[propertyStyles.type, { color: factoryProperty ? 'white' : '#7D7F88' }]}>Factory</Text>
                                                </TouchableOpacity>
                                            </ScrollView>
                                            :
                                            btnColorComercial === false && btnColorResidentiol == false && btnColorSemiComercial == true ?
                                                <ScrollView
                                                    horizontal={true}
                                                    showsHorizontalScrollIndicator={false}
                                                    contentContainerStyle={propertyStyles.container}>
                                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: housesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(9)}>
                                                        <Text style={[propertyStyles.type, { color: housesProperty ? 'white' : '#7D7F88' }]}>House</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: plotsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(10)}>
                                                        <Text style={[propertyStyles.type, { color: plotsProperty ? 'white' : '#7D7F88' }]}>Plot</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: shopsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(11)}>
                                                        <Text style={[propertyStyles.type, { color: shopsProperty ? 'white' : '#7D7F88' }]}>Shop</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: files ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(18)}>
                                                        <Text style={[propertyStyles.type, { color: files ? 'white' : '#7D7F88' }]}>Files</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: officesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(12)}>
                                                        <Text style={[propertyStyles.type, { color: officesProperty ? 'white' : '#7D7F88' }]}>Office</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: agricultureProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(13)}>
                                                        <Text style={[propertyStyles.type, { color: agricultureProperty ? 'white' : '#7D7F88' }]}>Agriculture</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: farmHousesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(14)}>
                                                        <Text style={[propertyStyles.type, { color: farmHousesProperty ? 'white' : '#7D7F88' }]}>Farm House</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: pentHopusesProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(15)}>
                                                        <Text style={[propertyStyles.type, { color: pentHopusesProperty ? 'white' : '#7D7F88' }]}>Pent House</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: buildingsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(16)}>
                                                        <Text style={[propertyStyles.type, { color: buildingsProperty ? 'white' : '#7D7F88' }]}>Building</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={[propertyStyles.typeContainer, , { backgroundColor: flatsProperty ? '#917AFD' : '#F2F2F3' }]} onPress={() => changePropertyHandler(17)}>
                                                        <Text style={[propertyStyles.type, { color: flatsProperty ? 'white' : '#7D7F88' }]}>Apartment</Text>
                                                    </TouchableOpacity>

                                                </ScrollView>
                                                : null
                                } */}
                                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                                {/* Own/Business ID Text*/}
                                <View style={{ width: '45%', flexDirection: "row", justifyContent: "space-between", alignSelf: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ color: "#6342E8", fontSize: 12, fontWeight: "bold" }}>Own Records</Text>
                                    <Text style={{ color: "#6342E8", fontSize: 12, fontWeight: "bold" }}>Business Records</Text>
                                </View>

                                <View style={{ flex: 0.1, flexDirection: "row", justifyContent: "space-between", marginLeft: 15, marginRight: 15, marginBottom: 20 }}>
                                    <View style={{ width: '20%' }}>
                                        <Text style={{ color: "#000000", fontSize: 14, fontWeight: "900" }}>Edit/ Write</Text>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end', marginRight: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                                            <CheckBox style={{ alignSelf: 'center' }}
                                                disabled={false}
                                                value={toggleCheckBox1}
                                                // onValueChange={(Value) => setToggleCheckBox1(Value)} 
                                                // onChange={() => changeReadHandler("Read", "yes")}
                                                tintColors={{ true: "#6342E8", false: "#6342E8" }}
                                                onValueChange={(text) => changeReadHandler("Read", text)}
                                            />
                                        </View>

                                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                                            <CheckBox
                                                disabled={false}
                                                value={toggleCheckBox2}
                                                // onValueChange={(Value) => setToggleCheckBox3(Value)} 
                                                onValueChange={(text) => changeReadHandler("Edit", text)}
                                                tintColors={{ true: "#6342E8", false: "#6342E8" }}
                                            />
                                        </View>

                                    </View>

                                </View>


                                {/* <View style={{ flex: 0.1, flexDirection: "row", justifyContent: "space-between", marginLeft: 15, marginRight: 15, marginBottom:20 }}>
                                    <View style={{ width:'20%' }}>
                                        <Text style={{ color: "#000000", fontSize: 14, fontWeight: "900" }}>Create/ Edit</Text>
                                    </View>
                                    <View style={{ width:'50%',alignItems:'flex-end',marginRight:20}}>
                                        <CheckBox
                                            disabled={false}
                                            value={toggleCheckBox2}
                                            // onValueChange={(Value) => setToggleCheckBox3(Value)} 
                                            onValueChange={(text) => changeReadHandler("Edit",text)}
                                            tintColors={{true:"#6342E8", false:  "#6342E8"}}
                                        />
                                        {/* {/* <CheckBox style={{}}
                                            disabled={false}
                                            value={toggleCheckBox4}
                                            // onValueChange={(Value) => setToggleCheckBox4(Value)}
                                            onValueChange={(text) => changeReadHandler("Edit","no", text)} 
                                        /> 
                                    </View>

                                </View>  */}



                                {/* <View style={{ flex: 0.1, flexDirection: "row", justifyContent: "space-between", marginLeft: 15, marginRight: 15, }}>
                                    <View style={{ flex: 0.55 }}>
                                        <Text style={{ color: "#000000", fontSize: 14, fontWeight: "900" }}>Tasks</Text>
                                    </View>
                                    <View style={{ flex: 0.4, flexDirection: "row", justifyContent: "space-evenly" }}>
                                        <CheckBox style={{}}
                                            disabled={false}
                                            value={toggleCheckBox5}
                                            onValueChange={(Value) => setToggleCheckBox5(Value)} />
                                        <CheckBox style={{}}
                                            disabled={false}
                                            value={toggleCheckBox6}
                                            onValueChange={(Value) => setToggleCheckBox6(Value)} />
                                    </View>
                                </View> */}
                                <View style={{ flex: 0.1, flexDirection: "row", margin: 15, justifyContent: "space-evenly" }}>
                                    <TouchableOpacity onPress={() => setCreateUserModal(!createUserModal)}
                                        style={{ flex: 0.4, height: 50, borderRadius: 5, borderWidth: 1, borderColor: "#6342E8", alignItems: 'center', justifyContent: 'center' }} >
                                        <Text style={{ fontSize: 14, color: "#000000", fontWeight: "900", padding: 10 }}>Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flex: 0.4, height: 50, elevation: 2, borderRadius: 5, backgroundColor: "#6342E8", borderWidth: 1, borderColor: "#E3E3E7", justifyContent: 'center', alignItems: "center" }}
                                        onPress={() => checkEmailHandler(number)}
                                    >
                                        <Text style={{ fontSize: 14, color: "#FFFFFF", fontWeight: "900", padding: 10 }}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            </View>

            {/* Edit Modal */}
            <View style={{ flex: 1 }}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={editUserModal}
                    onRequestClose={() => {
                        setEditUserModal(!editUserModal);
                    }}
                >
                    <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "flex-end",
                    }}>
                        <View style={{ backgroundColor: 'gray', opacity: 0.5, flex: 0.9 }}></View>
                        <View keyboardShouldPersistTaps='handled' style={{
                            flex: 0.1,
                            //    justifyContent:"flex-end",
                            // margin: 20,
                            backgroundColor: '#aaaaaa',
                            // borderTopLeftRadius: 50,
                            // borderTopRightRadius: 50,
                            // padding: 35,
                            shadowColor: '#000',
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 4,
                            elevation: 20,
                        }}>
                            <View style={{ height: '100%', backgroundColor: 'white', borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
                                <View style={{ flex: 0.5, margin: 15, }}>
                                    <View style={{ flex: 0.2, flexDirection: 'row-reverse', marginBottom: -30 }}>
                                        <TouchableOpacity style={{ marginRight: 20 }}
                                            onPress={() => setEditUserModal(!editUserModal)}>
                                            <Icon2 name="cross" color="#A1A1A1" size={25} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 0.8, }}>
                                        <View style={{ alignItems: 'center' }}>
                                            <Image style={{ width: 69, height: 69, }} resizeMode='stretch' source={require('../assets/images/personpic.png')} />
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignItems: 'center' }}>
                                            <Text style={{ marginTop: 15, color: "#000000", fontSize: 14, fontWeight: "700" }}>Name</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                {
                                                    !showName ?
                                                        <Text style={{ color: "#808080", fontSize: 13, fontWeight: "700", marginRight: 10 }}>{editData?.name}</Text> : null
                                                }

                                                <TouchableOpacity onPress={() => setShowName(!showName)}>
                                                    <Person
                                                        name='pencil-outline'
                                                        size={15}
                                                        color="black"
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                        </View>

                                        {
                                            showName ?
                                                <TextInput
                                                    style={{ width: "99%", borderBottomWidth: 1, borderColor: "#E2E2E2", padding: 0, fontSize: 12, fontWeight: "500", marginTop: 10 }}
                                                    placeholder="Enter Name"
                                                    value={editName}
                                                    onChangeText={(val) => setEditName(val)}
                                                /> : null
                                        }
                                        {/* <TextInput
                                        style={{ width: "99%", borderBottomWidth: 1, borderColor: "#E2E2E2", padding: 0, fontSize: 12, fontWeight: "500" }}
                                        placeholder="Enter Mobile Number"
                                    /> */}

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignItems: 'center' }}>
                                            <Text style={{ marginTop: 15, color: "#000000", fontSize: 14, fontWeight: "700" }}>Contact</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                {
                                                    !showContact ?
                                                        <Text style={{ color: "#808080", fontSize: 13, fontWeight: "700", marginRight: 10 }}>{editData?.contact}</Text> : null
                                                }
                                                <TouchableOpacity onPress={() => setShowContact(!showContact)}>
                                                    <Person
                                                        name='pencil-outline'
                                                        size={15}
                                                        color="black"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {
                                            showContact ?
                                                <TextInput
                                                    style={{ width: "99%", borderBottomWidth: 1, borderColor: "#E2E2E2", padding: 0, fontSize: 12, fontWeight: "500", marginTop: 10 }}
                                                    placeholder="Enter Mobile Number"
                                                    value={editContact}
                                                    onChangeText={(val) => setEditContact(val)}
                                                /> : null
                                        }

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignItems: 'center' }}>
                                            <Text style={{ marginTop: 15, color: "#000000", fontSize: 14, fontWeight: "700" }}>Email</Text>
                                            <Text style={{ marginTop: 15, color: "#808080", fontSize: 13, fontWeight: "700" }}>{editData?.email}</Text>
                                        </View>

                                        {/* <TextInput
                                        style={{ width: "99%", borderBottomWidth: 1, borderColor: "#E2E2E2", padding: 0, fontSize: 12, fontWeight: "500" }}
                                        placeholder="Enter Password"
                                    /> */}
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', alignSelf: 'center' }}>
                                    <Text style={{ color: "#6342E8", fontSize: 16, fontWeight: "bold", marginLeft: 30 }}>Rights</Text>

                                    {/* <View style={{ width:'80%'}}> */}
                                    {/* <Text style={{ color: "#6342E8", fontSize: 12, fontWeight: "bold" }}>Own Records</Text> */}
                                    <Text style={{ color: "#6342E8", fontSize: 16, fontWeight: "bold", marginRight: 25 }}>Records</Text>
                                    {/* </View> */}
                                </View>

                                <View style={{ flex: 0.1, flexDirection: "row", justifyContent: "space-between", marginLeft: 15, marginBottom: 20 }}>
                                    <View style={{ width: '50%', marginTop: 10 }}>
                                        {/* <Text style={{ color: "#000000", fontSize: 14, fontWeight: "900", marginTop:20 }}>Edit/ Write</Text> */}
                                        <Text style={{ color: "#000000", fontSize: 14, fontWeight: "500" }}>Own Records</Text>
                                        <Text style={{ color: "#000000", fontSize: 14, fontWeight: "500", marginTop: 10 }}>Business Records</Text>
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'flex-end', marginRight: 10, }}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '50%', marginLeft: -20 }}>
                                            <CheckBox style={{ alignSelf: 'center' }}
                                                disabled={false}
                                                value={editToggleCheckBox1}
                                                tintColors={{ true: "#6342E8", false: "#6342E8" }}
                                                onValueChange={(text) => changeEditHandler("Read", text)}
                                            />
                                        </View>

                                        <View style={{ alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                                            <CheckBox
                                                disabled={false}
                                                value={editToggleCheckBox2}
                                                onValueChange={(text) => changeEditHandler("Edit", text)}
                                                tintColors={{ true: "#6342E8", false: "#6342E8" }}
                                            />
                                        </View>

                                    </View>

                                </View>

                                {/* <View style={{ flex: 0.1, flexDirection: "row", justifyContent: "space-between", marginLeft: 15, marginRight: 15, }}>
                                <View style={{ flex: 0.55 }}>
                                    <Text style={{ color: "#000000", fontSize: 14, fontWeight: "900" }}>Can view on records</Text>

                                </View>
                                <View style={{ flex: 0.4, flexDirection: "row", justifyContent: "space-evenly" }}>
                                    <CheckBox style={{}}
                                        disabled={false}
                                    // value={toggleCheckBox1}
                                    // onValueChange={(Value) => setToggleCheckBox1(Value)}
                                    />
                                    <CheckBox style={{}}
                                        disabled={false}
                                    // value={toggleCheckBox2}
                                    // onValueChange={(Value) => setToggleCheckBox2(Value)} 
                                    />
                                </View>

                            </View>


                            <View style={{ flex: 0.1, flexDirection: "row", justifyContent: "space-between", marginLeft: 15, marginRight: 15, }}>
                                <View style={{ flex: 0.55 }}>
                                    <Text style={{ color: "#000000", fontSize: 14, fontWeight: "900" }}>Can view all records</Text>

                                </View>
                                <View style={{ flex: 0.4, flexDirection: "row", justifyContent: "space-evenly" }}>
                                    <CheckBox style={{}}
                                        disabled={false}
                                    // value={toggleCheckBox3}
                                    // onValueChange={(Value) => setToggleCheckBox3(Value)} 
                                    />
                                    <CheckBox style={{}}
                                        disabled={false}
                                    // value={toggleCheckBox4}
                                    // onValueChange={(Value) => setToggleCheckBox4(Value)} 
                                    />
                                </View>

                            </View>



                            <View style={{ flex: 0.1, flexDirection: "row", justifyContent: "space-between", marginLeft: 15, marginRight: 15, }}>
                                <View style={{ flex: 0.55 }}>
                                    <Text style={{ color: "#000000", fontSize: 14, fontWeight: "900" }}>Right no 2</Text>

                                </View>
                                <View style={{ flex: 0.4, flexDirection: "row", justifyContent: "space-evenly" }}>
                                    <CheckBox style={{}}
                                        disabled={false}
                                    // value={toggleCheckBox5}
                                    // onValueChange={(Value) => setToggleCheckBox5(Value)}
                                    />
                                    <CheckBox style={{}}
                                        disabled={false}
                                    // value={toggleCheckBox6}
                                    // onValueChange={(Value) => setToggleCheckBox6(Value)} 
                                    />
                                </View>

                            </View> */}



                                <View style={{ flex: 0.1, flexDirection: "row", margin: 15, justifyContent: "space-evenly" }}>
                                    <TouchableOpacity onPress={() => setEditUserModal(!editUserModal)}
                                        style={{ flex: 0.4, height: 50, borderRadius: 5, borderWidth: 1, borderColor: "#6342E8", alignItems: 'center', justifyContent: 'center' }} >
                                        <Text style={{ fontSize: 14, color: "#000000", fontWeight: "900", padding: 10 }}>Back</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flex: 0.4, height: 50, elevation: 2, borderRadius: 5, backgroundColor: "#6342E8", borderWidth: 1, borderColor: "#E3E3E7", justifyContent: 'center', alignItems: "center" }}
                                        onPress={() => updateUserHandler()}
                                    >
                                        <Text style={{ fontSize: 14, color: "#FFFFFF", fontWeight: "900", padding: 10 }}>Save</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            </View>

            {/* Disable User Modal */}
            <View style={{ flex: 1 }}>
                {/* this modal is used for added product in firebase  */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={disableUserModal}
                    onRequestClose={() => {
                        setDisableUserModal(!disableUserModal);
                    }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: 'black', opacity: 0.77, flex: 0.5 }}></View>
                        <View
                            style={{
                                // height: 846,
                                flex: 0.3,
                                // marginTop: '50%',
                                // elevation: 7,
                                backgroundColor: '#494848',
                                // opacity:0.5
                                // opacity:0.1
                            }}>
                            <View style={styles.footer}>
                                <TouchableOpacity style={{ alignSelf: "flex-end", marginRight: 15, marginTop: 10 }}
                                    onPress={() => { setDisableUserModal(!disableUserModal), setDisableUserData() }}
                                >
                                    <Icon
                                        name='close'
                                        color='gray'
                                        size={20}
                                        style={{ alignSelf: 'flex-end' }}
                                    />
                                </TouchableOpacity>
                                <View style={{ width: '90%', alignSelf: 'center' }}>
                                    <Text style={{ alignSelf: 'center', fontSize: 20, fontWeight: '700', color: '#674CEC', marginTop: 10, textAlign: 'center' }}>
                                        Are you sure you want to {disableUserData?.status == "Active" ? "disable" : "activate"} {disableUserData?.name}?
                                    </Text>
                                </View>


                                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 40, width: '90%', alignSelf: 'center' }}>
                                    <TouchableOpacity
                                        style={{
                                            borderColor: '#674CEC',
                                            borderWidth: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '30%',
                                            height: 30,
                                            borderRadius: 5
                                        }}
                                        onPress={() => { setDisableUserModal(false), setDisableUserData() }}
                                    >
                                        <Text style={{ color: '#674CEC', fontSize: 13, fontWeight: '600' }}>No</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#674CEC',
                                            // borderWidth:1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '30%',
                                            height: 30,
                                            borderRadius: 5
                                        }}
                                        onPress={() => disableUserHandler()}
                                    >
                                        <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>Yes</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                        <View style={{ backgroundColor: 'black', opacity: 0.77, flex: 0.4 }}></View>
                    </View>
                </Modal>

            </View>


            {/* Payment Modal */}
            <View style={{ flex: 1 }}>
                {/* this modal is used for added product in firebase  */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={paymentModal}
                    onRequestClose={() => {
                        setPaymentModal(!paymentModal);
                    }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: 'black', opacity: 0.77, flex: 0.5 }}></View>
                        <View
                            style={{
                                // height: 846,
                                flex: 0.35,
                                // marginTop: '50%',
                                // elevation: 7,
                                backgroundColor: '#494848',
                                // opacity:0.5
                                // opacity:0.1
                            }}>
                            <View style={styles.footer}>
                                <TouchableOpacity style={{ alignSelf: "flex-end", marginRight: 15, marginTop: 10 }}
                                    onPress={() => { setPaymentModal(!paymentModal) }}
                                >
                                    <Icon
                                        name='close'
                                        color='gray'
                                        size={20}
                                        style={{ alignSelf: 'flex-end' }}
                                    />
                                </TouchableOpacity>
                                <View style={{ width: '90%', alignSelf: 'center' }}>

                                    <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: '600', color: '#674CEC', marginTop: 10, textAlign: 'center' }}>
                                        Please enter total users you want to Create:
                                    </Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '80%', alignSelf: 'center', marginTop: 10 }}>
                                        <TouchableOpacity
                                            style={{
                                                // borderColor:"red",
                                                // borderWidth:1,
                                                width: '30%',
                                                height: 30,
                                                alignItems: 'center',
                                                backgroundColor: inputUsers < 2 ? "#BABCBF" : '#674CEC',
                                                justifyContent: 'center',
                                                borderRadius: 15
                                            }}
                                            onPress={() => { setInputUsers(prev => prev - 1) }}
                                            disabled={inputUsers < 2 ? true : false}
                                        >
                                            <Icons
                                                name='minus'
                                                color="white"
                                                // color="black"
                                                size={25}
                                            />
                                        </TouchableOpacity>
                                        <Text style={{ fontFamily: 'SF Pro Text', fontSize: 20, fontWeight: '700' }}>{inputUsers}</Text>
                                        <TouchableOpacity
                                            style={{
                                                // borderColor:"red",
                                                // borderWidth:1,
                                                width: '30%',
                                                height: 30,
                                                alignItems: 'center',
                                                backgroundColor: '#674CEC',
                                                justifyContent: 'center',
                                                borderRadius: 15
                                            }}
                                            onPress={() => { setInputUsers(prev => prev + 1) }}
                                        >
                                            <Icons
                                                name='plus'
                                                color="white"
                                                // color="black"
                                                size={25}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {/* <TextInput
                                        style={{borderColor:'gray', borderWidth:1, width:'90%', alignSelf:'center',marginTop:10, height:40}}
                                        textAlign="center"
                                        value={inputUsers}
                                        onChange={(text) => setInputUsers(text)}
                                    /> */}

                                    <TouchableOpacity
                                        style={{
                                            // borderColor:'#674CEC',
                                            // borderWidth:1,
                                            backgroundColor: '#674CEC',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            alignSelf: 'center',
                                            marginTop: 25,
                                            width: '90%',
                                            height: 40,
                                            borderRadius: 5
                                        }}
                                        // onPress={() => navigation.navigate("payment", inputUsers)}
                                        onPress={() => updateUserTotal(inputUsers)}
                                    >
                                        <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>Continue</Text>
                                    </TouchableOpacity>


                                </View>


                                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-around',marginTop:40,width:'90%',alignSelf:'center' }}>
                                    <TouchableOpacity
                                        style={{
                                            borderColor:'#674CEC',
                                            borderWidth:1,
                                            alignItems:'center',
                                            justifyContent:'center',
                                            width:'30%',
                                            height:30,
                                            borderRadius:5
                                        }}
                                        onPress={() => {setDisableUserModal(false), setDisableUserData()}}
                                    >
                                        <Text style={{color:'#674CEC',fontSize:13,fontWeight:'600'}}>No</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor:'#674CEC',
                                            // borderWidth:1,
                                            alignItems:'center',
                                            justifyContent:'center',
                                            width:'30%',
                                            height:30,
                                            borderRadius:5
                                        }}
                                        onPress={() => disableUserHandler()}
                                    >
                                        <Text style={{color:'white',fontSize:13,fontWeight:'600'}}>Yes</Text>
                                    </TouchableOpacity>
                                </View> */}
                            </View>

                        </View>
                        <View style={{ backgroundColor: 'black', opacity: 0.77, flex: 0.45 }}></View>
                    </View>
                </Modal>

            </View>

        </View>
    );

}

const styles = StyleSheet.create({
    btnContianer: {
        width: "92%",
        marginTop: 20,
        flexDirection: "row",
        alignSelf: "center",
        marginBottom: 5,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    btnStyle: {
        elevation: 2,
        borderRadius: 5,
        backgroundColor: "#FDFDFD",
        height: 34,
        width: 90,
        borderWidth: 0.5,
        borderColor: "#E3E3E7",
        justifyContent: 'center',
        alignItems: "center"
    },
    btnText: {
        color: "#8A73FB",
        fontSize: 12,
        fontWeight: "500",
        letterSpacing: 0.013
    },
    underline: {
        width: "92%",
        alignSelf: "center",
        borderWidth: 0.8,
        borderColor: "#D6D6D6",
        marginTop: 17,
    },
    footer: {
        flex: 1,
        // borderColor: '#674CEC',
        // borderWidth:1,
        backgroundColor: 'white',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        // borderTopLeftRadius: 8,
        // borderTopRightRadius: 8
        opacity: 1,
        width: '90%',
        alignSelf: 'center',
        elevation: 7
    },
})

const propertyStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        // width:'60%',
        justifyContent: 'space-between',
        marginBottom: 10
    },

    containerOne: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        width: "250%",
        justifyContent: 'space-between',
        marginBottom: 10
    },
    typeContainer: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        // paddingHorizontal: 10,
        height: 35,
        width: 80,
        marginHorizontal: 5,
        // elevation: 7,
        marginVertical: 5
    },
    type: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        color: '#7D7F88'
    },

    containerCatagory: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 20,
        // width:'60%'
        justifyContent: 'space-between',
        marginBottom: 10
    },
    typeContainercatagory: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        height: 36,
        width: 120,
        // elevation: 7
    },
    typecategory: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        color: '#7D7F88'
    },
})
