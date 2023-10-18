import React, { useState, useEffect, useContext } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, Image, Keyboard, TextInput } from 'react-native'

import firestore from '@react-native-firebase/firestore'
import { MaskedTextInput } from "react-native-mask-text";

import AreasAPI from '../api/AreaAPI'
import InventoryAPI from '../api/InventoryAPIs/CreateInventory'
import LeadAPI from '../api/LeadsRequest'
import DealAPI from '../api/DealRequest'

import useAuth from '../auth/useAuth'
import { AuthContext } from '../auth/AuthProvider'

import { Picker } from '@react-native-picker/picker'
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons'
import Cross from 'react-native-vector-icons/Entypo'



const CITIES = [
    {
        "id": 0,
        "cityId": 0,
        "name": "Select City"
    },
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

const Header = ({ onPress, image }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerIconContainer} onPress={onPress}>
                <Icon
                    name='chevron-back-outline'
                    color="black"
                    size={25}
                />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerText}>User Profile</Text>
            </View>
            <Image
                style={{ width: 30, height: 30, borderRadius: 50 }} resizeMode='contain'
                //source={user.photoURL}
                source={{ uri: image }}
            />
        </View>
    )
}

const UpdateButton = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.updateButton} onPress={onPress}>
            <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
    )
}

const StatusBox = ({ quantity, date, type, size }) => {
    return (
        <View style={[styles.statusBox, { height: size ? 120 : 127 }]}>
            <View style={{ alignSelf: 'center', marginTop: 5 }}>
                <Text style={styles.statusQuantity}>{quantity}</Text>
                <Text style={styles.date}>{date}</Text>
            </View>

            <View>
                {
                    type == "Inventory" ?
                        <Image
                            source={require('../assets/images/inventoryIcon.png')}
                            style={{ width: 25, height: 23, alignSelf: 'flex-start', marginLeft: 10 }}
                        />
                        : type == "Leads" ?
                            <Image
                                source={require('../assets/images/leadIcon.png')}
                                style={{ width: 13, height: 18, alignSelf: 'flex-start', marginLeft: 15 }}
                            />
                            :
                            type == "Deals" ?
                                <Image
                                    source={require('../assets/images/dealsIcon.png')}
                                    style={{ width: 15, height: 18, alignSelf: 'flex-start', marginLeft: 15 }}
                                />
                                :
                                <Image
                                    source={require('../assets/images/tasksIcon.png')}
                                    style={{ width: 16, height: 18, alignSelf: 'flex-start', marginLeft: 18 }}
                                />
                }

                <Text style={styles.statusType}>Total {type}</Text>
            </View>

        </View>
    )
}

export default function UserProfile({ navigation }) {

    const { user } = useContext(AuthContext);

    // const name = AsyncStorage.getItem("@city");


    const [value, setValue] = useState("")
    const [city, setCity] = useState("0")
    const [cityName, setCityName] = useState("Select City")
    const [mobileNumber, setMobileNumber] = useState('')
    const [businessName, setBusinessName] = useState('')

    const [cities, setCities] = useState([])

    const [currentDate, setCurrentDate] = useState('');

    const [data, setData] = useState([])
    const [profileData, setProfileData] = useState([])
    const [loading, setLoading] = useState(false)
    const [leads, setLeads] = useState(0)
    const [inventory, setInventory] = useState(0)
    const [deal, setDeal] = useState(0)

    const [showCity, setShowCity] = useState(true)
    const [showNumber, setShowNumber] = useState(true)
    const [showBusiness, setShowBusiness] = useState(true)

    const [countryName, setCountryName] = useState()
    const [countryValue, setCountryValue] = useState()

    const [keyShow, setKeyShow] = useState(false)

    const [oldCity, setOldCity] = useState("")


    const [showPicker, setShowPicker] = useState(false)

    useEffect(() => {
        getProfileData()
        const unsubscribe = navigation.addListener('focus', () => {
            getProfileData()
        });

        return () => {
            unsubscribe;
        };

    }, [])

    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        Keyboard.addListener('keyboardDidHide', keyboardDidHide)
        return () => {
            Keyboard.addListener('keyboardDidShow', keyboardDidShow).remove();
            Keyboard.addListener('keyboardDidHide', keyboardDidHide).remove();
        }
    }, [])

    const keyboardDidShow = () => {
        setKeyShow(true);
    };

    const keyboardDidHide = () => {
        setKeyShow(false);
    };

    useEffect(() => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        setCurrentDate(
            date + '/' + month + '/' + year
        );

    }, []);

    useEffect(() => {
        getID()
    }, [])

    const getID = async () => {
        var city = await AsyncStorage.getItem("@city");
        setOldCity(city)
    }

    console.log("oldCity=>>>>", oldCity)

    // useEffect(() => {
    //     getProfileData()
    //     // getInventoryAndLeads()
    // }, [])

    const getProfileData = async () => {
        setLoading(true)
        const UID = user.uid
        const response = await AreasAPI.getProfileData(UID)
        console.log("uid=>>>>", response)
        setProfileData(response)
        setShowPicker(false)
        setShowBusiness(true)
        setShowNumber(true)
        setLoading(false)
        // if (response && response.ok && response.length>0){
        //     setProfileData(JSON.parse(response))
        //     
        //     setLoading(false)
        // }
        // else {
        //     setLoading(false)
        // }
    }

    // useEffect(() => {
    //     getInventoryAndLeads()
    // }, [])

    // const getInventoryAndLeads = async() => {
    //     setLoading(true)
    //     const UID = user.uid
    //     const response = await InventoryAPI.inventoryCount(UID)
    //     const response1 = await LeadAPI.leadCount(UID)
    //     const response2 = await DealAPI.getDealCount(UID)

    //     setInventory(response.length)
    //     setLeads(response1.length)
    //     setDeal(response2.length)
    //     setLoading(false)
    // }

    // console.log("profileData",profileData)
    const getData = async () => {
        setLoading(true)
        var countryID = await AsyncStorage.getItem("@countryID");
        var country = await AsyncStorage.getItem("@country");
        // var oldCityID = await AsyncStorage.getItem("@cityID");

        const response = await AreasAPI.getSocieties(city)
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", response.data.response)
        if (response.ok) {
            var data = response.data.response
            // data = data.toString().replace(/'/g, '"');
            // console.log("sadlfkjsaldkfjlksadjfl;ksajdf;lkjsadklfj",data)
            //    console.log(typeof data)
            // data = JSON.parse(data);
            // console.log(typeof data)
            // console.log(data)
            setData(data)
            // useAuth().areas(data, cityName, city)
            useAuth().areas(data, cityName, city, country, countryID)
            // console.log("data added to storage")
            setLoading(false)
        }
        else {
            // Alert.alert("Error")
            setLoading(false)
        }

    }

    // console.log(city)


    const OnChangePickerSeletedHandler = (value, index) => {
        console.log("asdfal;kasjdf", value)
        setValue(value)
        setCity(CITIES[index].cityId)
        setCityName(CITIES[index].name)
    }

    const showCitiesHander = async () => {
        setLoading(true)
        var countryID = await AsyncStorage.getItem("@countryID");
        const response = await AreasAPI.getCities(countryID)
        if (response.ok && response.data && response.data.response && response.data.response.length > 0) {
            setCities(response.data.response)

            setLoading(false)
            setShowCity(true)
        }
        else {
            // Alert.alert("Error")
            setLoading(false)
        }
    }





    const updateInfoHandler = async () => {
        
        if(mobileNumber == "" && businessName == "" && value == 0){
           alert("please enter updated details in any field!")
            return true
        }
        if (mobileNumber && mobileNumber.length < 12) {
           alert("Mobile Number should be of 11 digits")
            return true
        }
        if (businessName && businessName.length > 24) {
           alert("Business Name should be less than 24 characters")
            return true
        }
        setLoading(true)
        if(value != 0){
            console.log("inside if")
            await getData()
        }
        // else{
        //     console.log("out side if")
        // }


        try {
            firestore()
                .collection('users')
                .doc(user.uid)
                .update({
                    mobile: mobileNumber != "" ? mobileNumber : profileData[0].mobile,
                    city: value == 0 ? oldCity : cityName,
                    businessName: businessName !== "" ? businessName : profileData[0].businessName
                })
                .then(() => {
                    alert("Information Updated Successfully!")
                    getProfileData()
                    setLoading(false)
                })

        } catch (err) {
            console.log(err)
            setLoading(false)
            Alert.alert(
                "Error occured"
            )
        }

    }

    // console.log(profileData)

    return (
        <View style={styles.screen}>
            <Header
                onPress={() => navigation.pop()}
                image={user.photoURL}
            />
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }

            {/* <Image
                source={{ uri: user.photoURL }}
                style={{ width: 100, height: 100, borderRadius: 100, alignSelf:'center',marginTop: '10%' }}
                resizeMode="contain"
            /> */}

            {/* <View style={{width:'80%',alignSelf:'center',marginTop:keyShow ? 15: 35,flexDirection:'row',justifyContent:'space-between', flexWrap:'wrap'}}>
                <StatusBox
                    quantity={inventory}
                    type="Inventory"
                    date={currentDate}
                    size={keyShow}
                />
                <StatusBox
                    quantity={leads}
                    type="Leads"
                    date={currentDate}
                    size={keyShow}
                />
                <StatusBox
                    quantity={deal}
                    type="Deals"
                    date={currentDate}
                    size={keyShow}
                />
                <StatusBox
                    quantity={leads}
                    type="Tasks"
                    date={currentDate}
                    size={keyShow}
                />             
            </View> */}


            <View style={{ width: '90%', alignSelf: 'center', marginTop: '20%' }}>

                <Text style={{ color: '#000000', fontSize: 20, marginVertical: 3, fontWeight: '600', }}>Country</Text>
                <Text style={{ color: '#696969', fontSize: 13, marginVertical: 3, fontWeight: '600', marginTop: 10 }}>{profileData && profileData.length > 0 ? profileData[0].country : ""}</Text>

                <Text style={{ color: '#000000', fontSize: 20, marginVertical: 3, fontWeight: '600', }}>City</Text>
                {
                    console.log(profileData)
                }
                {/* {
                    showCity ? */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>

                    {
                        showPicker ?
                            <View style={[styles.countryPickerStyle, { width: '100%', height: "140%", flexDirection: "row", }]}>
                                <View style={{ justifyContent: "center", width: "92%", }}>
                                    <Picker
                                        selectedValue={value}
                                        onValueChange={(itemValue, itemIndex) => OnChangePickerSeletedHandler(itemValue, itemIndex)}
                                        itemStyle={{ borderColor: 'red', borderWidth: 1 }}
                                        style={{ height: 10, marginRight: -10, marginLeft: -15 }}
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
                                <View style={{ justifyContent: "center" }}>
                                    <TouchableOpacity onPress={() => {setShowPicker(false),setValue(0)}}>

                                        <Cross
                                            name='cross'
                                            color="black"
                                            size={20}
                                            style={{ alignSelf: 'flex-end' }}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <>
                                <Text style={{ color: '#696969', fontSize: 13, marginVertical: 3, fontWeight: '600', marginTop: 10 }}>{profileData && profileData.length > 0 ? profileData[0].city : ""}</Text>

                                <TouchableOpacity style={{ width: '40%' }} onPress={() => setShowPicker(true)}>
                                    <Icon
                                        name='pencil'
                                        color="black"
                                        size={20}
                                        style={{ alignSelf: 'flex-end' }}
                                    />
                                </TouchableOpacity>
                            </>

                    }

                </View>
                {/* :
                        <View style={styles.countryPickerStyle}>
                            <Picker
                                selectedValue={value}
                                onValueChange={(itemValue, itemIndex) => OnChangePickerSeletedHandler(itemValue, itemIndex)}
                                itemStyle={{ borderColor: 'red', borderWidth: 1 }}
                                style={{ height: 10 }}
                            >
                                {
                                    cities.map((item, index) => {
                                        return (
                                            <Picker.Item label={item.name} value={item.id} />
                                        )
                                    })
                                }
                            </Picker>
                        </View>
                } */}
                {/* <Text 
                    style={{ 
                        color: 'red', 
                        fontSize: 12, 
                        marginVertical: 3, 
                        fontWeight: '500', 
                        // marginTop: 3 
                    }}
                >
                    Mobile number should constist of 12 digits
                </Text> */}

                <Text style={{ color: '#000000', fontSize: 15, marginVertical: 3, fontWeight: '600', marginTop: keyShow ? 10 : 20 }}>Business Name</Text>

                {
                    showBusiness ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            {/* <Text style={{ color: '#000000', fontSize: 15, marginVertical: 3, fontWeight: '600', marginTop: 10 }}>{profileData && profileData.length>0 ? profileData[0].mobile : ""}</Text> */}
                            <Text style={{ color: '#696969', fontSize: 13, marginVertical: 3, fontWeight: '600', }}>{profileData && profileData.length > 0 ? profileData[0].businessName : ""}</Text>
                            <TouchableOpacity style={{ width: '40%' }} onPress={() => setShowBusiness(!showBusiness)}>
                                <Icon
                                    name='pencil'
                                    color="black"
                                    size={20}
                                    style={{ alignSelf: 'flex-end' }}
                                />
                            </TouchableOpacity>

                        </View>
                        :

                        <View style={{ ...styles.placeholderStyle, flexDirection: "row" }}>

                            <TextInput
                                placeholder='Enter Business Name'
                                style={{ width: "93%", marginLeft: 2 }}
                                // type="custom"
                                // mask="0399-9999999"
                                value={businessName}
                                keyboardType="default"
                                onChangeText={(text) => setBusinessName(text)}
                                // onChangeText={(text) => validateMobileNumber(text)}
                                placeholderTextColor="#676767"
                            />
                            <View style={{ justifyContent: "center" }}>
                                <TouchableOpacity onPress={() => {setShowBusiness(!showBusiness),setBusinessName("")}}>
                                    <Cross
                                        name='cross'
                                        color="black"
                                        size={20}
                                        style={{ alignSelf: 'flex-end' }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                }


                <Text style={{ color: '#000000', fontSize: 15, marginVertical: 3, fontWeight: '600', marginTop: keyShow ? 15 : 10 }}>Phone Number</Text>

                {
                    showNumber ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            <Text style={{ color: '#696969', fontSize: 13, marginVertical: 3, fontWeight: '600', }}>{profileData && profileData.length > 0 ? profileData[0].mobile : ""}</Text>
                            <TouchableOpacity style={{ width: '40%', justifyContent: "center", marginTop: 4 }} onPress={() => setShowNumber(false)}>
                                <Icon
                                    name='pencil'
                                    color="black"
                                    size={20}
                                    style={{ alignSelf: 'flex-end' }}
                                />
                            </TouchableOpacity>

                        </View>
                        :
                        <View style={{ ...styles.placeholderStyle, flexDirection: "row" }}>

                            <MaskedTextInput
                                placeholder='Enter Mobile Number'
                                type="custom"
                                style={{ width: "93%", marginLeft: 2 }}
                                mask="0399-9999999"
                                value={mobileNumber}
                                keyboardType="phone-pad"
                                onChangeText={(text) => setMobileNumber(text)}
                                // onChangeText={(text) => validateMobileNumber(text)}
                                placeholderTextColor="#676767"
                            />
                            <View style={{ justifyContent: "center" }}>
                                <TouchableOpacity onPress={() => {setShowNumber(true),setMobileNumber("")}}>
                                    <Cross
                                        name='cross'
                                        color="black"
                                        size={20}
                                        style={{ alignSelf: 'flex-end' }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                }



            </View>

            <UpdateButton
                onPress={() => updateInfoHandler()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FCFCFC'
    },
    header: {
        flexDirection: 'row',
        width: '95%',
        alignSelf: 'center',
        // borderColor: 'red',
        // borderWidth: 1,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerIconContainer: {
        backgroundColor: '#FDFDFD',
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#E3E3E7',
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 7
    },
    headerText: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 21,
        color: '#404040'
    },
    placeholderStyle: {
        borderColor: '#676767',
        borderWidth: 0.5,
        fontFamily: "poppins",
        marginVertical: 5,
        fontSize: 12,
        // lineHeight: 18,
        fontWeight: "400",
        // paddingBottom: 5,
        // paddingTop: 5,
        color: '#000000',
        borderRadius: 4
    },
    countryPickerStyle: {
        backgroundColor: "white",
        color: "#7D7F88",
        // alignItems: 'center', 
        justifyContent: 'center',
        // margin: 15, 
        // width: '50%',
        borderRadius: 4,
        borderColor: "#BABCBF",
        marginTop: 10,
        //marginTop: -20,
        borderWidth: 1,
        // marginBottom: 10,
        elevation: 2,
        height: 35
    },
    updateButton: {
        // borderColor:'red',
        // borderWidth:1,
        width: '90%',
        alignSelf: 'center',
        height: 50,
        marginTop: '30%',
        backgroundColor: '#876FF9',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    statusBox: {
        width: '35%',
        borderRadius: 20,
        // borderColor:'green',
        // borderWidth:1,
        height: 127,
        justifyContent: 'space-between',
        backgroundColor: 'white',
        elevation: 4,
        marginBottom: 20
    },
    statusQuantity: {
        color: '#696969',
        fontSize: 16,
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: '600',
        // alignSelf:'center'
    },
    date: {
        color: '#AEAEAE',
        fontSize: 14,
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: '400'
    },
    statusType: {
        color: '#404040',
        fontSize: 16,
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: '400',
        alignSelf: 'center',
        marginBottom: 5
    },
    updateButtonText: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 20,
        fontWeight: '700'
    }
})