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
import Icon1 from 'react-native-vector-icons/FontAwesome'
import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
import InventoryCard from '../../components/InventoryCard';
import DealCard from '../../components/DealCard/DealCard';
import Spinner from 'react-native-loading-spinner-overlay';

import AsyncStorage from '@react-native-async-storage/async-storage'

const INVOICE_NUMBER = Math.floor(Math.random() * 90000) + 10000;

export default function Dealdetail({ route, navigation }) {
    const items = route.params
    // console.log("Done: ", items)

    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)

    const [countryID, setCountryID] = useState('')
    console.log("INVOICE_NUMBER", INVOICE_NUMBER)

    const [accessType, setAccessType] = useState()
    const [accessBusinessID, setAccessBusinessID] = useState()

    useEffect(() => {
        getCurrency()
    }, [])

    const getCurrency = async () => {
        var country = await AsyncStorage.getItem("@country");
        setCountryID(country)
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}>
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
                    <Text style={HeaderStyle.HeaderText}>Deal Details</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: user.photoURL }} />
                </View>
            </View>

            {/* Body */}
            <View style={{ width: "90%", marginHorizontal: "5%" }}>
                {/* Commission Detail View */}
                <View style={{ marginTop: 10 }}>
                    <Text style={[styles.textHeading, { marginTop: 10 }]}>Title</Text>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: '#A1A1A1' }}>{items.title}</Text>
                    {/* {
                        items.role == "business" ?
                        <>
                            <Text style={[styles.textHeading, { marginTop: 10 }]}>Created By:</Text>
                            <Text style={{ fontSize: 15, fontWeight: '500', color: '#A1A1A1' }}>{items.name}</Text>
                        </> : null
                    } */}
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                    <Text style={styles.textHeading}>Deal Amount</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#A1A1A1', alignSelf: 'flex-end' }}>
                        {countryID == "UAE" ? "AED " : countryID == "India" ? "INR " : countryID == "Bangladesh" ? "BDT " : "PKR "} {items.dealAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {
                            items.inventoryDetail.transactionType == "Let" ? " /Month" : null
                        }
                    </Text>
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    <Text style={[styles.textHeading, { marginTop: 10 }]}>Buyer Name</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#A1A1A1', alignSelf: 'flex-end' }}>{items.buyerName}</Text>
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    <Text style={styles.textHeading}>Buyer Commission</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {
                            items.buyerAmountinRs > 0 ?
                                <TouchableOpacity
                                    style={{
                                        borderColor: '#876FF9',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        width: '30%',
                                        height: 25,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => navigation.navigate('CustomerInvoice',
                                        {
                                            "type": accessType ? accessType : "business",
                                            "businessID": accessBusinessID ? accessBusinessID : user.uid,
                                            'Name': items.buyerName,
                                            'Detail': items.inventoryDetail.cityName + ', ' + items.inventoryDetail.societyName,
                                            'Commission': items.buyerAmountinRs,
                                            "accountType": "Customer"
                                        }
                                    )}
                                >
                                    <Text style={{
                                        color: '#876FF9',
                                        fontSize: 12,
                                        fontWeight: '600',
                                        alignSelf: 'center'
                                    }}>Create Invoice</Text>
                                </TouchableOpacity>
                                : <View />
                        }
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#A1A1A1', alignSelf: 'flex-end' }}>
                            {countryID == "UAE" ? "AED " : countryID == "India" ? "INR " : countryID == "Bangladesh" ? "BDT " : "PKR "} {items.buyerAmountinRs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                    </View>
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    <Text style={[styles.textHeading, { marginTop: 10 }]}>Seller Name</Text>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#A1A1A1', alignSelf: 'flex-end' }}>{items.sellerName}</Text>
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    <Text style={styles.textHeading}>Seller Commission</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {
                            items.sellerAmountinRs > 0 ?
                                <TouchableOpacity
                                    style={{
                                        borderColor: '#876FF9',
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        width: '30%',
                                        height: 25,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onPress={() => navigation.navigate('CustomerInvoice',
                                        {
                                            "type": accessType ? accessType : "business",
                                            "businessID": accessBusinessID ? accessBusinessID : user.uid,

                                            'Name': items.sellerName,
                                            'Detail': items.inventoryDetail.cityName + ', ' + items.inventoryDetail.societyName,
                                            'Commission': items.sellerAmountinRs,
                                            "accountType": "Customer"

                                        }
                                    )}
                                >
                                    <Text style={{
                                        color: '#876FF9',
                                        fontSize: 12,
                                        fontWeight: '600',
                                        alignSelf: 'center'
                                    }}>Create Invoice</Text>
                                </TouchableOpacity>
                                : <View />
                        }
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#A1A1A1', alignSelf: 'flex-end' }}>
                            {countryID == "UAE" ? "AED " : countryID == "India" ? "INR " : countryID == "Bangladesh" ? "BDT " : "PKR "} {items.sellerAmountinRs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Text>
                    </View>
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />
                </View>

                {/* Inventory Card */}
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DealInventoryDetail', items)}>
                    <View style={styles.imageContainer}>
                        {
                            items.inventoryDetail.propertyImg ?
                                <Image
                                    source={{ uri: items.inventoryDetail.propertyImg }}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode='stretch'
                                />
                                :
                                <Image
                                    source={require('../../assets/images/nommage.jpg')}
                                    style={{ width: '100%', height: '100%' }}
                                    resizeMode='contain'
                                />
                        }
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text numberOfLines={1} style={styles.houseName}>{items.inventoryDetail.houseName}</Text>
                        <Text numberOfLines={1} style={styles.houseAddress}>{items.inventoryDetail.cityName}, {items.inventoryDetail.societyName}</Text>
                        <Text numberOfLines={1} style={styles.property}>{items.inventoryDetail.propertyType}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', marginTop: 5, alignItems: 'center' }}>
                            {
                                items.inventoryDetail.propertyType == 'Plot' || items.inventoryDetail.propertyType == 'Files' || items.inventoryDetail.propertyType == 'Shop' || items.inventoryDetail.propertyType == 'Agriculture' ?
                                    null
                                    :
                                    <>
                                        <Icon1
                                            name='bed'
                                            color='#7D7F88'
                                            size={14}
                                        />
                                        <Text numberOfLines={1} style={styles.houseAddress}>{items.inventoryDetail.rooms.bedrooms} Room</Text>
                                    </>
                            }
                            <View style={{flexDirection:"row"}}>

                            <Icon1
                                name='home'
                                color='#7D7F88'
                                size={14}
                            />
                            </View>
                            <Text numberOfLines={1} style={{...styles.houseAddress,marginRight:40}}>{items.inventoryDetail.size + " " + items.inventoryDetail.sizeType}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={styles.houseRent}>{countryID == 2 ? "AED " : countryID == 3 ? "INR " : countryID == 4 ? "BDT " : "PKR "}{items.inventoryDetail.demand.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                {
                                    items.inventoryDetail.transactionType == "Sale" ?
                                        <Text style={styles.rentType}></Text>
                                        :
                                        <Text style={styles.rentType}>/ month</Text>
                                }
                            </Text>
                            <Text style={{ fontSize: 14, fontWeight: '900', alignSelf: 'flex-end', color: '#826AF7' }}>Inventory</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Lead Card */}
                <TouchableOpacity style={styles.mainContainer} onPress={() => navigation.navigate('DealLeadDetail', items)}>
                    <View style={styles.upperContainer}>
                        <Text style={styles.nameText}>{items.leadDetail.leadName}</Text>
                        <Text style={[styles.mobileText]}>{items.leadDetail.mobile}</Text>
                    </View>
                    <View style={styles.lowerContainer}>
                        <Text style={styles.textStyle}>{items.leadDetail.size} {items.leadDetail.size_type}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#826AF7' }}>{items.inventoryDetail.transactionType}</Text>
                    </View>
                </TouchableOpacity>

                {/* Back Button */}
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate("Deal")}>
                    <Text style={{ fontSize: 12, fontWeight: '900', color: "#ffffff" }}>Back</Text>
                </TouchableOpacity>
            </View>

        </ScrollView>
    )
}


const styles = StyleSheet.create({
    textHeading: {
        color: "#000000",
        fontSize: 15,
        fontWeight: "900",
        marginBottom: 8
        // alignSelf: 'center'
    },


    card: {
        width: '100%',
        alignSelf: 'center',
        marginBottom: 20,
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 3,
        borderRadius: 10,
        overflow: 'hidden',
        height: 135,
        marginTop: 10
    },
    imageContainer: {
        width: '25%',
        alignItems: 'center',
    },
    detailsContainer: {
        width: '70%',
        marginLeft: 10,
    },
    houseName: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '800',
        fontSize: 16,
        fontStyle: 'normal',
        marginTop: 10
    },
    houseAddress: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal',
        marginRight:5,

        // flex: 1,
        marginLeft: 3
    },
    houseRent: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 18,
        fontStyle: 'normal',
        marginTop: 10
    },
    rentType: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal'
    },


    mainContainer: {
        width: '100%',
        height: 80,
        alignSelf: 'center',
        backgroundColor: 'white',
        elevation: 3,
        borderRadius: 10,
        overflow: 'hidden',
    },
    underline: {
        borderWidth: 0.6,
        margin: 15,
        marginTop: 8,
        borderColor: "#D6D6D6"
    },
    upperContainer: {
        flexDirection: "row",
        marginTop: 15,
        justifyContent: "space-between",
        marginLeft: 5,
        marginRight: 5

    },
    textStyle: {
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "normal",
    },
    mobileText: {
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "normal",
        textAlign: "right"
    },
    nameText: {
        color: "#1A1E25",
        fontSize: 15,
        fontWeight: "600",
        width: "75%"
    },
    lowerContainer: {
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-between",
        marginLeft: 5,
        marginRight: 15,
        marginBottom: 5
    },
    ViewinventryBtn:
    {
        backgroundColor: "#F2F2F3",
        borderRadius: 5,
        borderWidth: 0.8,
        borderColor: "#E3E3E7",
        width: "47%",
        height: 30,
        marginRight: 22,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inventryText: {
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "normal",
        padding: 5
    },


    btn: {
        width: "100%",
        height: 47,
        backgroundColor: "#876FF9",
        marginTop: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: "center",
        marginBottom: 20
    },
    property: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        fontStyle: 'normal',
        flex: 1,
        marginLeft: 3
    },
})




