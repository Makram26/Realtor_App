import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, Keyboard, BackHandler, TextInput, Alert, ScrollView } from 'react-native'

import { MaskedTextInput } from "react-native-mask-text";
import { Picker } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/Ionicons'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import Spinner from 'react-native-loading-spinner-overlay';

import auth from '@react-native-firebase/auth'
import { AuthContext } from "../auth/AuthProvider"
import useAuth from '../auth/useAuth';
import AreasAPI from '../api/AreaAPI'

import SocietyAPI from '../api/AreaAPI'

const COUNTRIES = [
    {
        "id": 1,
        "name": "Pakistan",
        "CC": "+92"
    },
    {
        "id": 2,
        "name": "UAE",
        "CC": "+971"
    },
    {
        "id": 3,
        "name": "India",
        "CC": "+91"
    },
    {
        "id": 4,
        "name": "Bangladesh",
        "CC": "+880"
    },
]

const CITIES = [
    {
        "id": 1,
        "cityId": 1,
        "name": "Lahore"
    },
    {
        "id": 2,
        "cityId": 2,
        "name": "Karachi"
    },
    {
        "id": 3,
        "cityId": 3,
        "name": "Islamabad"
    },
    {
        "id": 4,
        "cityId": 41,
        "name": "Rawalpindi"
    },
    {
        "id": 5,
        "cityId": 15,
        "name": "Multan"
    },
    {
        "id": 6,
        "cityId": 17,
        "name": "Peshawar"
    },
    {
        "id": 7,
        "cityId": 16,
        "name": "Faisalabad"
    },
    {
        "id": 8,
        "cityId": 327,
        "name": "Gujranwala"
    },
    {
        "id": 9,
        "cityId": 30,
        "name": "Hyderabad"
    },
    {
        "id": 10,
        "cityId": 480,
        "name": "Sialkot"
    },
    // {
    //     "id": 11,
    //     "cityId": 23,
    //     "name": "Bahawalpur"
    // },
    // {
    //     "id": 12,
    //     "cityId": 36,
    //     "name": "Murree"
    // },
    // {
    //     "id": 13,
    //     "cityId": 385,
    //     "name": "Abbottabad"
    // },
    // {
    //     "id": 14,
    //     "cityId": 778,
    //     "name": "Sargodha"
    // },
    // {
    //     "id": 15,
    //     "cityId": 459,
    //     "name": "Wah"
    // },
    // {
    //     "id": 16,
    //     "cityId": 782,
    //     "name": "Sahiwal"
    // },
    // {
    //     "id": 17,
    //     "cityId": 20,
    //     "name": "Gujrat"
    // },
    // {
    //     "id": 18,
    //     "cityId": 18,
    //     "name": "Quetta"
    // }
]

// Header Component
const Header = () => {
    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.headerText}>User Information</Text>
            </View>
        </View>
    )
}

// Button Component
const ContinueButton = ({ onPress, button }) => {
    return (
        <TouchableOpacity style={[styles.button, { marginTop: button ? '5%' : '20%' }]} onPress={onPress}>
            <Text style={styles.buttonText}>Continue</Text>
            <Icon
                name='chevron-forward-circle'
                color="white"
                size={20}
                style={{ marginLeft: 15, alignSelf: 'center' }}
            />
        </TouchableOpacity>
    )
}

const ContinueButtonDisable = ({ button }) => {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: 'gray', marginTop: button ? '5%' : '20%' }]}>
            <Text style={styles.buttonText}>Continue</Text>
            <Icon
                name='chevron-forward-circle'
                color="white"
                size={20}
                style={{ marginLeft: 15, alignSelf: 'center' }}
            />
        </TouchableOpacity>
    )
}

export default function UserInformation({ route }) {

    const items = route.params
    // console.log("items", items)

    const { Googlelogin } = useContext(AuthContext)

    const [mobileNumber, setMobileNumber] = useState('')
    const [businessName, setBusinessName] = useState('')
    const [value, setValue] = useState("")
    const [city, setCity] = useState("1")
    const [cityName, setCityName] = useState("Lahore")
    const [keyShow, setKeyShow] = useState(false)

    const [profileData, setProfileData] = useState([])

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    const [country, setCountry] = useState("+92")
    const [countryName, setCountryName] = useState("Pakistan")
    const [countryValue, setCountryValue] = useState("1")

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

    // Society States
    const [societyName, setSocietyName] = useState('')
    const [searchSocietyName, setSearchSocietyName] = useState('')
    const [societyData, setSocietyData] = useState()
    const [filterSocietyData, setFilterSocietyData] = useState()

    // const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', keyboardDidHide)
        return () => {
            Keyboard.addListener('keyboardDidShow', keyboardDidShow).remove();
            Keyboard.addListener('keyboardDidHide', keyboardDidHide).remove();
        }
    }, [])

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    const keyboardDidShow = () => {
        setKeyShow(true);
    };

    const keyboardDidHide = () => {
        setKeyShow(false);
    };

    const getCities = async () => {
        setLoading(true)
        const response = await AreasAPI.getCities(1)
        console.log("cities", response.data.response)
        if (response.ok && response.data && response.data.response && response.data.response.length > 0) {
            setProfileData(response.data.response)
            setCity(response.data.response[0].cityId)
            setCityName(response.data.response[0].name)
            setMobileNumber('')
            setLoading(false)
        }
        else {
            // Alert.alert("Error")
            setLoading(false)
        }
    }

    const getData = async () => {
        setLoading(true)
        const response = await AreasAPI.getSocieties(city)
        if (response.ok) {
            var data = response.data.response
            // data = data.replace(/'/g, '"');
            // data = JSON.parse(data);
            // console.log(typeof data)
            console.log("Storage Areas==>>", data)
            console.log("Storage Rest==>>", cityName, city, "Pakistan", 1)
            // setData(data)
            useAuth().areas(data, cityName, city, "Pakistan", 1)
            // console.log("data added to storage")
            setLoading(false)
        }
        else {
            // Alert.alert("Error")
            setLoading(false)
        }
    }
    // Society Selection
    // useEffect(() => {
    //     getID()
    // }, [])

    const getID = async () => {
        var data = await AsyncStorage.getItem("@areas");
        var city = await AsyncStorage.getItem("@city");
        var country = await AsyncStorage.getItem("@country");
        // console.log(data)
        setCityName(city)
        setCountry(country)
        data = data.replace(/'/g, '"');
        data = JSON.parse(data);
        setSocietyData(data)
        console.log("id===>>", data)
    }

    const searchFilter = (text) => {
        if (text) {
            const newData = societyData.filter((item) => {
                const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilterSocietyData(newData)
            setSearchSocietyName(text)
        } else {
            setFilterSocietyData(societyData)
            setSearchSocietyName(text)
        }
    }

    const changeSocietyName = (name) => {
        setSocietyName(name)
        setSearchSocietyName("")
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

    const [deviceToken, setDeviceToken] = useState('')
    messaging().getToken().then(token => {
        setDeviceToken(token) 
    })
    
    const addUserInfoHandler = async () => {
        // if(businessName && businessName.length > 24){
        //     Alert.alert("Business Name should be less than 24 characters")
        //     return true
        // }
        setLoading(true)
        const res = await Googlelogin()
        // console.log("response data User Info", res)
        const user = auth().currentUser;
        // await getData()
        // console.log("user=>>>>>>", user)
        await getData()
        if (mobileNumber && businessName) {
            // Update Information
            try {
                await firestore()
                    .collection("users")
                    .doc(user.uid)
                    .set({
                        id: user.uid,
                        email: user.email,
                        image: user.photoURL,

                        mobile: mobileNumber,
                        country: countryName,
                        city: cityName,
                        // societyName: societyName,
                        // catagory: btnColorResidentiol ? 'Residential' : btnColorComercial ? 'Commercial' : 'Semi Commercial',
                        // propertyType: houseProperty ? 'House' : flatProperty ? 'Flat' : farmHouseProperty ? 'Farm House' : pentHouseProperty ? 'Pent House' : officeProperty ? 'Office' : shopProperty ? 'Shop' : buildingProperty ? 'Building' : factoryProperty ? 'Factory' : housesProperty ? 'House' : plotsProperty ? 'Plot' : shopsProperty ? 'Shop' : officesProperty ? 'Office' : agricultureProperty ? 'Agriculture' : farmHousesProperty ? 'Farm House' : pentHopusesProperty ? 'Pent House' : buildingsProperty ? 'Building' : files ? 'Files' : 'Flat',
                        isAdmin: true,
                        businessName: businessName,
                        totaUsers: 0,
                        timestamp: firestore.Timestamp.fromDate(new Date()),
                        deviceToken: deviceToken,
                    })
                    .then(() => {
                        // Alert.alert(
                        //     "Inventory Added",
                        //     //"Image and Data has been uploaded successfully!"
                        // )
                        console.log("Added to backend")
                        setLoading(false)
                        setMobileNumber('')
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

    const OnChangePickerSeletedHandler = (value, index) => {
        setValue(value)
        setCity(CITIES[index].cityId)
        setCityName(CITIES[index].name)
    }
    console.log(city)

    const OnChangCountrySeletedHandler = (value, index) => {
        console.log(value, index)
        setCountryValue(value)
        setCountry(COUNTRIES[index].CC)
        setCountryName(COUNTRIES[index].name)
        // getCities(value)
    }

    // console.log(city)
    // console.log(mobileNumber)

    return (
        <ScrollView contentContainerStyle={styles.screen}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <Header />
            <View style={{ alignItems: 'center', marginTop: 30 }}>
                <Text style={{ color: 'black', fontSize: 20, fontWeight: '600' }}>Hello <Text style={{ color: 'black', fontSize: 25, fontWeight: '700' }}>{items.user.givenName.toUpperCase()}</Text></Text>
                <View style={{ marginTop: 10 }} />
                <Text style={{ color: 'black', fontSize: 18, fontWeight: '400', marginTop: 5 }}>Congratulations on creating account</Text>
                <Text style={{ color: 'black', fontSize: 18, fontWeight: '400', marginTop: 5 }}>You are almost there</Text>
                <Text style={{ color: 'black', fontSize: 18, fontWeight: '400', marginTop: 5 }}>We just need a few information from you</Text>
            </View>
            <View style={{ width: '95%', alignSelf: 'center', marginTop: keyShow ? 20 : 50, justifyContent: 'space-between' }}>
                {/* <Text style={{ color: '#000000', fontSize: 15, marginVertical: 3, fontWeight: '600', marginTop: 10 }}>Select Country <Text style={{ color: 'red' }}> *</Text></Text> */}
                {/* <View style={{flexDirection:'row',alignItems:'center', width:'100%'}}> */}

                {/* <View style={styles.countryPickerStyle}>
                    <Picker
                        selectedValue={countryValue}
                        onValueChange={(itemValue, itemIndex) => OnChangCountrySeletedHandler(itemValue, itemIndex)}
                        itemStyle={{ borderColor: 'red', borderWidth: 1 }}
                        style={{ height: 10 }}
                    >
                        {
                            COUNTRIES.map((item, index) => {
                                return (
                                    <Picker.Item label={item.name} value={item.id} />
                                )
                            })
                        }
                    </Picker>
                </View> */}
                {/* <TouchableOpacity 
                        style={{ backgroundColor:'#6A4FEE', width:'10%', height:35, alignItems:'center', justifyContent:'center', marginTop: 10,borderRadius:5,elevation:2  }}
                    >
                        <Icon name="search" color="white" size={22} />
                    </TouchableOpacity> */}
                {/* </View> */}
                <Text style={styles.heading}>Mobile Number <Text style={{ color: 'red' }}> *</Text></Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                    {/* <Text style={{ color: 'black', fontSize: 15, borderColor: '#696969', borderWidth: 0.5, padding: 7 }}>+92</Text>  */}
                    <MaskedTextInput
                        placeholder='Enter Mobile Number'
                        style={[styles.placeholderStyle, { flex: 1 }]}
                        type="custom"
                        // mask={countryValue == 1 ? "0399-9999999" : countryValue == 2 ? "50-999-9999" : countryValue == 3 ? "9999-999999" : "01999-999999"}
                        mask='0399-9999999'
                        value={mobileNumber}
                        keyboardType="phone-pad"
                        onChangeText={(text) => setMobileNumber(text)}
                        // onChangeText={(text) => validateMobileNumber(text)}
                        placeholderTextColor="#676767"
                    />
                </View>
                {
                    countryValue == 1 && mobileNumber && mobileNumber.length < 12 ?
                        <Text
                            style={{
                                color: 'red',
                                fontSize: 12,
                                marginVertical: 3,
                                fontWeight: '500',
                                // marginTop: 3 
                            }}
                        >
                            Mobile number should consist of 12 digits
                        </Text>
                        : countryValue == 2 && mobileNumber && mobileNumber.length < 10 ?
                            <Text
                                style={{
                                    color: 'red',
                                    fontSize: 12,
                                    marginVertical: 3,
                                    fontWeight: '500',
                                    // marginTop: 3 
                                }}
                            >
                                Mobile number should consist of 10 digits
                            </Text>
                            : countryValue == 3 && mobileNumber && mobileNumber.length < 11 ?
                                <Text
                                    style={{
                                        color: 'red',
                                        fontSize: 12,
                                        marginVertical: 3,
                                        fontWeight: '500',
                                        // marginTop: 3 
                                    }}
                                >
                                    Mobile number should consist of 11 digits
                                </Text>
                                : countryValue == 4 && mobileNumber && mobileNumber.length < 12 ?
                                    <Text
                                        style={{
                                            color: 'red',
                                            fontSize: 12,
                                            marginVertical: 3,
                                            fontWeight: '500',
                                            // marginTop: 3 
                                        }}
                                    >
                                        Mobile number should consist of 12 digits
                                    </Text>
                                    : null
                }

                <Text style={{ color: '#000000', fontSize: 15, marginVertical: 3, fontWeight: '600', marginTop: 10 }}>Business Name <Text style={{ color: 'red' }}> *</Text></Text>
                <TextInput
                    placeholder='Enter Business Name'
                    style={styles.placeholderStyle}
                    // type="custom"
                    // mask="0399-9999999"
                    value={businessName}
                    keyboardType="default"
                    onChangeText={(text) => setBusinessName(text)}
                // onChangeText={(text) => validateMobileNumber(text)}
                />

                {
                    businessName && businessName.length > 24 ?
                        <Text
                            style={{
                                color: 'red',
                                fontSize: 12,
                                marginVertical: 3,
                                fontWeight: '500',
                                // marginTop: 3 
                            }}
                        >
                            Business Name should be less than 24 characters
                        </Text>
                        : null
                }


                {/* Catagory Type
                <Text style={styles.heading}>Category</Text>
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
                }
                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} /> */}


                <Text style={{ color: '#000000', fontSize: 15, marginVertical: 3, fontWeight: '600', marginTop: 10 }}>Select City <Text style={{ color: 'red' }}> *</Text></Text>
                <View style={[styles.countryPickerStyle, { width: '100%' }]}>
                    <Picker
                        selectedValue={value}
                        onValueChange={(itemValue, itemIndex) => OnChangePickerSeletedHandler(itemValue, itemIndex)}
                        itemStyle={{ borderColor: 'red', borderWidth: 1 }}
                        style={{ height: 10 }}
                    >
                        {
                            CITIES.map((item, index) => {
                                return (
                                    <Picker.Item label={item.name} value={item.id} />
                                )
                            })
                        }
                    </Picker>
                </View>

                {/* Society  */}
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 18, color: 'black', fontWeight: '600' }}>Society: <Text style={{ color: 'red' }}> *</Text></Text>
                </View>

                <View style={styles.societyContainer}>
                    <TextInput
                        placeholder='Search society here...'
                        placeholderTextColor="#1A1E25"
                        style={styles.demandInput1}
                        keyboardType='default'
                        value={searchSocietyName}
                        onChangeText={(text) => searchFilter(text)}
                    />
                    <Icon
                        name='search-outline'
                        color="#1A1E25"
                        size={25}
                        style={{ marginRight: 20 }}
                    />
                </View>
                {
                    searchSocietyName !== "" ?
                        <View style={{ height: 200, marginTop: 10 }}>
                            <FlatList
                                data={filterSocietyData}
                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity
                                            style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginBottom: 5 }}
                                            onPress={() => changeSocietyName(item.name)}
                                        >
                                            <Text style={{ color: 'black', fontSize: 15, marginBottom: 10, marginLeft: 10 }}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </View>
                        : null

                } */}

            </View>

            {
                !mobileNumber ?
                    <ContinueButtonDisable
                        button={keyShow}
                    />
                    :
                    !businessName ?
                        <ContinueButtonDisable
                            button={keyShow}
                        />
                        :
                        countryValue == 1 && mobileNumber && mobileNumber.length < 12 ?
                            <ContinueButtonDisable
                                button={keyShow}
                            />
                            : countryValue == 2 && mobileNumber && mobileNumber.length < 10 ?
                                <ContinueButtonDisable
                                    button={keyShow}
                                />
                                : countryValue == 3 && mobileNumber && mobileNumber.length < 11 ?
                                    <ContinueButtonDisable
                                        button={keyShow}
                                    />
                                    : countryValue == 4 && mobileNumber && mobileNumber.length < 12 ?
                                        <ContinueButtonDisable
                                            button={keyShow}
                                        />
                                        :
                                        businessName && businessName.length > 24 ?
                                            <ContinueButtonDisable
                                                button={keyShow}
                                            />
                                            :
                                            <ContinueButton
                                                onPress={() => addUserInfoHandler()}
                                                button={keyShow}
                                            />
            }

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flexGrow: 1,
        backgroundColor: '#FCFCFC',
        // justifyContent:'space-between'
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center',
        // borderColor: 'red',
        // borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: '#6A4FEE',
        elevation: 5
    },
    headerText: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 21,
        color: 'white',
        alignSelf: 'center'
    },
    heading: {
        color: '#000000',
        fontSize: 15,
        marginVertical: 3,
        fontWeight: '600',
        marginTop: 10
    },
    placeholderStyle: {
        borderColor: '#676767',
        borderWidth: 0.5,
        fontFamily: "poppins",
        marginVertical: 5,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: "400",
        paddingBottom: 5,
        paddingTop: 5,
        color: '#000000',
        borderRadius: 4
    },
    countryPickerStyle: {
        backgroundColor: "white",
        color: "#7D7F88",
        // alignItems: 'center', 
        justifyContent: 'center',
        // margin: 15, 
        // width: '90%',
        borderRadius: 4,
        borderColor: "gray",
        marginTop: 10,
        //marginTop: -20,
        borderWidth: 1,
        // marginBottom: 10,
        elevation: 2,
        height: 35,
        // flexDirection:'row'
    },
    button: {
        width: '95%',
        alignSelf: 'center',
        height: 45,
        // borderColor:'red',
        // borderWidth:1,
        marginTop: '30%',
        backgroundColor: '#6A4FEE',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        flexDirection: 'row'
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: '700',
        letterSpacing: 0.5
    }
})

const propertyStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 20,
        // width:'60%',
        justifyContent: 'space-between',
        marginBottom: 10
    },

    containerOne: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 20,
        // width:'60%',

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

    societyContainer: {
        backgroundColor: '#F2F2F3',
        borderWidth: 0.8,
        borderColor: '#E3E3E7',
        borderRadius: 10,
        alignItems: 'center',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between'
        // marginTop: 15,
        // marginBottom: 10
    },
})