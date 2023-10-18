import React, { useState, useContext, useEffect } from 'react'
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
    Alert,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Dimensions,
    Button,
    BackHandler,
    PermissionsAndroid,
    Modal
} from 'react-native';

import { AuthContext } from '../../auth/AuthProvider'
import firestore from '@react-native-firebase/firestore'
import Icon from 'react-native-vector-icons/Ionicons'
import CheckBox from '@react-native-community/checkbox';

import { MaskedTextInput } from "react-native-mask-text";
import Spinner from 'react-native-loading-spinner-overlay';
import AreasAPI from '../../api/AreaAPI'

const Header = ({ goBack, photoURL }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerIconContainer} onPress={goBack}>
                <Icon
                    name='chevron-back-outline'
                    color="black"
                    size={25}
                />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerText}>Add To Marketplace</Text>
            </View>
            <Image
                style={{ width: 30, height: 30, borderRadius: 50 }} resizeMode='contain'
                source={{ uri: photoURL }}
            />
        </View>
    )
}

export default function AddToMarketplace({ navigation, route }) {
    const { user } = useContext(AuthContext);

    const inventories = route.params
    console.log("inventories==>>>", inventories)

    const {
        societyName,
        cityName,
        id,
        transactionType,
        houseName,
        demand,
        rooms,
        size,
        sizeType,
        propertyImg,
        facilities,
        description,
        catagory,
        unitType,
        floorType,
        propertyType,
        isLead,
        leadID,
        businessID,
        role,
        country
    } = inventories

    console.log(facilities)

    // facilities
    const {
        ownerBuild,
        corner,
        gas,
        gated,
        mainRoad,
        facingPark,
    } = facilities

    const [uploadImage, setUploadImage] = useState(false)
    const [houseNo, setHouseNo] = useState('')
    const [demands, setDemand] = useState('')

    const [descriptions, setDescription] = useState('')

    const [uploadAddress, setUploadAddress] = useState(false)
    const [phoneNo, setPhoneNo] = useState('')


    const [loading, setLoading] = useState(false)

    // Boolean States
    const [showDemand, setShowDemand] = useState(false)
    const [showAddress, setShowAddress] = useState(false)
    const [mobileNumber, setMobileNumber] = useState(false)

    // User Profile
    const [profileData, setProfileData] = useState("")

    useEffect(() => {
        getProfileData()
        const unsubscribe = navigation.addListener('focus', () => {
            getProfileData()
        });
        return () => {
            unsubscribe;
        };
    }, [])

    const getProfileData = async () => {
        setLoading(true)
        const UID = user.uid
        const response = await AreasAPI.getUserMobile(UID)
        console.log("uid=>>>>", response[0].mobile)
        setProfileData(response[0].mobile)
        setLoading(false)
    }

    // const userPhone = profileData[0].mobile
    // console.log("User NUmber : ", profileData[0].mobile)


    const addToMarketplaceHandler = async () => {
        setLoading(true)
        try {
            firestore()
                .collection('Marketplace')
                .add({
                    user_id: user.uid,
                    houseName: uploadAddress ? houseNo !== "" ? houseNo.trim() : houseName : "",
                    country: "Pakistan",
                    cityName: cityName,
                    societyName: societyName,
                    transactionType: transactionType,
                    catagory: catagory,
                    propertyType: propertyType,
                    unitType: unitType,
                    floorType: floorType,
                    propertyImg: uploadImage ? propertyImg : null,
                    demand: demands !== "" ? demands : demand,
                    size: size,
                    sizeType: sizeType,
                    rooms: rooms,
                    facilities: facilities,
                    description: descriptions.trim(),
                    timestamp: firestore.Timestamp.fromDate(new Date()),
                    deal: false,
                    mobileNumber: profileData !== "" ? profileData.trim() : mobileNumber,
                    // isLead: false,
                    businessID: businessID,
                    role: role,
                    name: user.displayName,
                    propertyID: id,
                    viewStatus: "Matched",
                }).then(() => {
                    // setLoading(false)
                    marketplaceInventory()
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const marketplaceInventory = async () => {
        setLoading(true)
        try {
            firestore()
                .collection('Inventory')
                .doc(id)
                .update({
                    toMarketplace: true
                })
                .then(() => {
                    console.log("Inventory Status Updated")
                    setLoading(false)
                    navigation.pop(2)
                })

        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    return (
        <View style={styles.screen}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <Header
                goBack={() => navigation.pop()}
                photoURL={user.photoURL}
            />
            {/* <Text style={{ color: '#696969', fontSize: 13, marginVertical: 3, fontWeight: '600', marginTop: 10 }}>{profileData}</Text> */}
            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#fbfcfa' }}>
                <View style={{ height: 221, width: '100%', marginTop: 10 }}>
                    {
                        propertyImg ?
                            <Image
                                source={{ uri: propertyImg }}
                                style={{ height: 221, width: '100%' }}
                                resizeMode="contain"
                            />
                            :
                            <Image
                                // source={require('../../assets/icons/Edit.png')}
                                source={require('../../assets/images/nommage.jpg')}
                                style={{ height: 221, width: '100%' }}
                                resizeMode="contain"
                            />
                    }
                </View>

                <View style={styles.checkboxContainer}>
                    <Text style={styles.checkboxText}>Show Image on Marketplace</Text>
                    <CheckBox
                        disabled={false}
                        value={uploadImage}
                        // onValueChange={(Value) => setToggleCheckBox1(Value)} 
                        // onChange={() => changeReadHandler("Read", "yes")}
                        tintColors={{ true: "#6342E8", false: "#6342E8" }}
                        onValueChange={(text) => setUploadImage(text)}
                    />
                </View>


                <View style={{ width: '90%', alignSelf: 'center' }}>
                    {/* <Text style={[styles.heading, { marginTop: 15 }]}>
                        Demand
                    </Text> */}
                    <View style={{
                        // width: '95%',
                        marginTop: 20,
                        // alignSelf: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={[styles.heading, { marginTop: 15 }]}>Demand</Text>
                        <TouchableOpacity onPress={() => setShowDemand(!showDemand)}>
                            <Icon
                                name='pencil-outline'
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>

                    </View>
                    {
                        showDemand ?
                            <View style={styles.demandContainer}>
                                <TextInput
                                    placeholder='Enter Demand'
                                    placeholderTextColor="#7D7F88"
                                    style={{ marginLeft: 10 }}
                                    // textAlign='left'
                                    keyboardType='number-pad'
                                    value={demands}
                                    onChangeText={(value) => setDemand(value)}
                                />
                            </View>
                            :
                            <Text style={{
                                color: '#A1A1A1',
                                fontSize: 15,
                                fontWeight: '700',
                                fontFamily: 'Lato',
                                marginTop: 5
                            }}>
                                PKR {demand}
                            </Text>
                    }

                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                    <Text style={[styles.heading, { marginTop: 25 }]}>
                        Size (Area)
                    </Text>
                    <Text style={{
                        color: '#A1A1A1',
                        fontSize: 15,
                        fontWeight: '700',
                        fontFamily: 'Lato',
                        marginTop: 5
                    }}>{size} {sizeType}</Text>

                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    {
                        propertyType == "House" ?
                            <>
                                <Text style={[styles.heading, { marginTop: 5 }]}>
                                    Unit
                                </Text>
                                <View style={unitStyles.container}>
                                    <TouchableOpacity style={[unitStyles.unitContainer, , { backgroundColor: unitType == "Single" ? '#917AFD' : '#F2F2F3' }]}>
                                        <Text style={[unitStyles.unit, { color: unitType == "Single" ? 'white' : '#7D7F88' }]}>Single</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[unitStyles.unitContainer, , { backgroundColor: unitType == "Double" ? '#917AFD' : '#F2F2F3' }]}>
                                        <Text style={[unitStyles.unit, { color: unitType == "Double" ? 'white' : '#7D7F88' }]}>Double</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[unitStyles.unitContainer, , { backgroundColor: unitType == "Other" ? '#917AFD' : '#F2F2F3' }]}>
                                        <Text style={[unitStyles.unit, { color: unitType == "Other" ? 'white' : '#7D7F88' }]}>Other</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                            </> : null
                    }

                    {
                        rooms.bedrooms !== 0 && rooms.bathrooms !== 0 ?
                            <>
                                <Text style={[styles.heading, { marginTop: 5 }]}>
                                    Rooms and Beds
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                                    <View style={{
                                        width: '30%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{ fontSize: 16, fontWeight: '400', fontFamily: 'Lato' }}>Bedrooms:</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '700', fontFamily: 'SF Pro Text' }}>{rooms.bedrooms}</Text>
                                    </View>
                                    <View style={{
                                        width: '30%',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <Text style={{ fontSize: 16, fontWeight: '400', fontFamily: 'Lato' }}>Bathrooms:</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '700', fontFamily: 'SF Pro Text' }}>{rooms.bathrooms}</Text>
                                    </View>
                                </View>
                                <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                            </>
                            : null
                    }


                    <Text style={[styles.heading, { marginTop: 5 }]}>
                        Society
                    </Text>
                    <View style={styles.placeFindContainer}>
                        <Text style={{ marginLeft: 15, color: '#1A1E25', fontWeight: '600' }}>{societyName}, {cityName}</Text>
                    </View>

                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    <View style={{
                        // width: '95%',
                        // marginTop: 20,
                        // alignSelf: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={[styles.heading, { marginTop: 5 }]}>Address to Display</Text>
                        <TouchableOpacity onPress={() => setShowAddress(!showAddress)}>
                            <Icon
                                name='pencil-outline'
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>

                    </View>
                    {
                        showAddress ?
                            <View style={styles.demandContainer}>
                                <TextInput
                                    placeholder='Enter Address'
                                    placeholderTextColor="#7D7F88"
                                    style={{ marginLeft: 10 }}
                                    // textAlign='left'
                                    keyboardType='default'
                                    value={houseNo}
                                    onChangeText={(value) => setHouseNo(value)}
                                />
                            </View>
                            :
                            <Text style={{
                                color: '#A1A1A1',
                                fontSize: 15,
                                fontWeight: '700',
                                fontFamily: 'Lato',
                                marginTop: 10
                            }}>{houseName}</Text>
                    }

                    <View style={[styles.checkboxContainer, { marginTop: 5 }]}>
                        <Text style={styles.checkboxText}>Show Address on Marketplace</Text>
                        <CheckBox
                            disabled={false}
                            value={uploadAddress}
                            // onValueChange={(Value) => setToggleCheckBox1(Value)} 
                            // onChange={() => changeReadHandler("Read", "yes")}
                            tintColors={{ true: "#6342E8", false: "#6342E8" }}
                            onValueChange={(text) => setUploadAddress(text)}
                        />
                    </View>
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    <Text style={[styles.heading, { marginTop: 5 }]}>
                        Property Facilities
                    </Text>
                    {/* <View style={styles.facilitiesContainer}>
                        <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: gas ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setGasFacilities(!gasFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: gasFacilities ? 'white' : '#7D7F88' }]}>Sui Gas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: facingParkFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setFacingParkFacilities(!facingParkFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: facingParkFacilities ? 'white' : '#7D7F88' }]}>Facing Park</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: mainRoadFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setMainRoadFacilities(!mainRoadFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: mainRoadFacilities ? 'white' : '#7D7F88' }]}>Main Road</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 109, marginTop: 25, backgroundColor: cornerFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setCornerFacilities(!cornerFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: cornerFacilities ? 'white' : '#7D7F88' }]}>Corner</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: gatedFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setGatedFacilities(!gatedFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: gatedFacilities ? 'white' : '#7D7F88' }]}>Gated</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: ownerBuildFacilities ? '#917AFD' : '#F2F2F3' }]} onPress={() => { setOwnerBuildFacilities(!ownerBuildFacilities) }}>
                            <Text style={[styles.facilitiesText, { color: ownerBuildFacilities ? 'white' : '#7D7F88' }]}>Owner Built</Text>
                        </TouchableOpacity>
                    </View> */}
                    <View style={styles.facilitiesContainer}>
                        <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: gas ? '#917AFD' : '#F2F2F3' }]}>
                            <Text style={[styles.facilitiesText, { color: gas ? 'white' : '#7D7F88' }]}>Sui Gas</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: facingPark ? '#917AFD' : '#F2F2F3' }]}>
                            <Text style={[styles.facilitiesText, { color: facingPark ? 'white' : '#7D7F88' }]}>Facing Park</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: mainRoad ? '#917AFD' : '#F2F2F3' }]}>
                            <Text style={[styles.facilitiesText, { color: mainRoad ? 'white' : '#7D7F88' }]}>Main Road</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 109, marginTop: 25, backgroundColor: corner ? '#917AFD' : '#F2F2F3' }]}>
                            <Text style={[styles.facilitiesText, { color: corner ? 'white' : '#7D7F88' }]}>Corner</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: gated ? '#917AFD' : '#F2F2F3' }]}>
                            <Text style={[styles.facilitiesText, { color: gated ? 'white' : '#7D7F88' }]}>Gated</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.facilities, { width: 109, backgroundColor: ownerBuild ? '#917AFD' : '#F2F2F3' }]}>
                            <Text style={[styles.facilitiesText, { color: ownerBuild ? 'white' : '#7D7F88' }]}>Owner Built</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    {/* Phone Number to Display */}
                    <View style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={[styles.heading, { marginTop: 5 }]}>Phone Number to Display</Text>
                        <TouchableOpacity onPress={() => setMobileNumber(!mobileNumber)}>
                            <Icon
                                name='pencil-outline'
                                size={20}
                                color="black"
                            />
                        </TouchableOpacity>

                    </View>
                    {
                        mobileNumber ?
                            <View style={styles.demandContainer}>
                                <TextInput
                                    placeholder='Enter Phone NUmber'
                                    placeholderTextColor="#7D7F88"
                                    style={{ marginLeft: 10 }}
                                    // textAlign='left'
                                    keyboardType='default'
                                    value={profileData}
                                    onChangeText={(value) => setProfileData(value)}
                                />
                            </View>
                            :
                            <Text style={{
                                color: '#A1A1A1',
                                fontSize: 15,
                                fontWeight: '700',
                                fontFamily: 'Lato',
                                marginTop: 10
                            }}>{profileData}</Text>
                    }

                    {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.heading, { marginTop: 5 }]}>
                            Phone Number to Display
                        </Text>
                        <Icon
                            name='pencil-outline'
                            size={20}
                            color="black"
                        />
                    </View>
                    <View style={styles.demandContainer}>
                        <MaskedTextInput
                            keyboardType="number-pad"
                            placeholder="Enter Mobile Number"
                            placeholderTextColor={"#A1A1A1"}
                            mask='0399-9999999'
                            value={mobileNumber}
                            onChangeText={(text) => setMobileNumber(text)}
                            style={{ marginLeft: 10, flex: 1 }}
                        />
                    </View> */}
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.heading, { marginTop: 5 }]}>
                            Note/ Details
                        </Text>
                        <Icon
                            name='pencil-outline'
                            size={20}
                            color="black"
                        />
                    </View>
                    <TextInput
                        style={{ borderBottomColor: '#E2E2E2', borderBottomWidth: 1, marginBottom: 20 }}
                        placeholder='Enter Note'
                        placeholderTextColor={"#A1A1A1"}
                        keyboardType="default"
                        multiline
                        numberOfLines={3}
                        value={descriptions}
                        onChangeText={(value) => setDescription(value)}

                    />

                    <TouchableOpacity style={styles.buttonContainer} onPress={addToMarketplaceHandler}>
                        <Text style={styles.buttonText}>SAVE</Text>
                    </TouchableOpacity>
                </View>



            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fbfcfa'
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
    heading: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 16,
        color: 'black',
        marginTop: 2
    },
    checkboxContainer: {
        marginTop: 20,
        width: '70%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // elevation:3,
        // backgroundColor:'white'
    },
    checkboxText: {
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'SF Pro Text',
        color: 'black'
    },
    placeFindContainer: {
        backgroundColor: '#F2F2F3',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 94,
        flexDirection: 'row',
        height: 48,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5
    },
    demandContainer: {
        backgroundColor: '#F2F2F3',
        borderWidth: 0.8,
        borderColor: '#E3E3E7',
        borderRadius: 94,
        // alignItems: 'center',
        height: 48,
        marginTop: 10,
        marginBottom: 10
    },
    facilitiesContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 10,
        // width: '70%',
        justifyContent: 'space-between',
        marginBottom: 15,
        flexWrap: 'wrap',
        marginLeft: 10
    },
    facilities: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        height: 40,
        width: 77,
        // flex:1,
        elevation: 1
    },
    facilitiesText: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        color: '#7D7F88'
    },
    buttonContainer: {
        width: '100%',
        alignSelf: 'center',
        marginVertical: 20,
        backgroundColor: '#876FF9',
        alignItems: 'center',
        borderRadius: 10,
        marginTop: 20,
        padding: 15,
        //elevation: 9
    },
    buttonText: {
        alignSelf: 'center',
        fontSize: 16,
        fontFamily: 'Lato',
        fontWeight: '900',
        color: 'white'
    },
})

const unitStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 20,
        width: '98%',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    unitContainer: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        height: 36,
        width: 106,
        // elevation: 7,
    },
    unit: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        color: '#7D7F88'
    }
})