import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { BackgroundImage } from 'react-native-elements/dist/config'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { shortenAddress } from '../functions/shortenAddress'
//import Icon from 'react-native-vector-icons/FontAwesome'
// const image = 'https://firebasestorage.googleapis.com/v0/b/traqeapp-cd46b.appspot.com/o/businessImages%2Frn_image_picker_lib_temp_611a2292-45c2-4106-9c9b-bdbb9c0d6b88.jpg?alt=media&token=cc745eb8-20a1-4aab-b5f1-f2b62725fb10'
export default function InventoryCard({
    propertyImg,
    houseName,
    address,
    rooms,
    area,
    areatype,
    rent,
    navigatePress,
    transactionType,
    country,
    propertyType
}) {
    const [countryID, setCountryID] = useState('')
    console.log(country)
    useEffect(() => {
        getCurrency()
    }, [])

    const getCurrency = async () => {
        var country = await AsyncStorage.getItem("@countryID");
        setCountryID(country)
    }
    return (
        <TouchableOpacity style={styles.card} onPress={navigatePress}>
            {/* Image Container */}
            <View style={styles.imageContainer}>
                {/* <BackgroundImage source={{uri: image}} style={{flex: 1}} resizeMode="stretch"> */}
                {
                    propertyImg ?
                        <Image
                            source={{ uri: propertyImg }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode='stretch'
                        />
                        :
                        <Image
                            //source={require('../assets/images/image2.jpg')}
                            source={require('../assets/images/nommage.jpg')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode='contain'
                        />
                }
                {/* </BackgroundImage> */}
            </View>


            {/* Property Details such as Property type and price etc. */}
            <View style={styles.detailsContainer}>
                {/* {console.log("houseName", houseName)} */}
                <Text numberOfLines={1} style={styles.houseName}>{houseName}</Text>
                <Text numberOfLines={1} style={styles.houseAddress}>{address}</Text>
                <Text style={styles.property}>{propertyType}</Text>

                {/* {
                    address.length > 40 ? 
                        <Text style={styles.houseAddress}>{`${address.substring(0, 30)}....`}</Text>
                    :
                    <Text style={styles.houseAddress}>{address}</Text>

                } */}


                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%',marginTop:5,alignItems: 'center' }}>
                    {
                        propertyType == 'Plot' || propertyType == 'Files' || propertyType == 'Shop' || propertyType == 'Agriculture' ?
                            null
                            :
                            <>
                                <Icon
                                    name='bed'
                                    color='#7D7F88'
                                    size={14}
                                />
                                <Text numberOfLines={1} style={styles.houseAddress}>{rooms} Rooms</Text>
                            </>
                    }
                   <View style={{flexDirection:"row",alignItems:"center"}}>

                    <Icon
                        name='home'
                        color='#7D7F88'
                        size={14}
                    />
                    <Text numberOfLines={1} style={{...styles.houseAddress,marginRight:40}}>{area + " " + areatype}</Text>
                   </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={styles.houseRent}>
                        {country == "UAE" ? "AED " : country == "India" ? "INR " : country == "Bangladesh" ? "BDT " : "PKR "}
                        {rent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {
                            transactionType == "Sale" ?
                                <Text style={styles.rentType}></Text>
                                :
                                <Text style={styles.rentType}>/ month</Text>
                        }

                    </Text>
                    {/* <TouchableOpacity onPress={favouritePress}>
                        <Icon
                            name='heart'
                            color={color}
                            size={20}
                            // style={{borderColor:'#7D7F88',borderWidth:1.5}}
                        />
                    </TouchableOpacity> */}
                </View>

            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '95%',
        alignSelf: 'center',
        // borderColor:'red',
        // borderWidth:1,
        marginBottom: 20,
        flexDirection: 'row',
        // padding:5,
        backgroundColor: 'white',
        height: 150,
        elevation: 4,
        borderRadius: 10,
        overflow: 'hidden',
        flex: 1
    },
    imageContainer: {
        width: '25%',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1
    },
    detailsContainer: {
        width: '70%',
        // borderColor:'blue',
        // borderWidth:1,
        marginLeft: 10,
        // justifyContent:'space-between'
    },
    rating: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        // marginTop: 10
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
        // marginLeft: 3
        // marginTop: 5
    },
    property: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        fontStyle: 'normal',
        // flex: 1,
        // marginLeft: 3
    },
    houseRent: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 18,
        fontStyle: 'normal',
        marginTop: 10
        // alignSelf:'flex-end'
    },
    rentType: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal'
    }
})