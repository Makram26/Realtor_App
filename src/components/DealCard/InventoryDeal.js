import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

import { shortenAddress } from '../../functions/shortenAddress'

export default function InventoryDeal({
    propertyImg,
    houseName,
    cityName,
    societyName,
    rooms,
    area,
    areatype,
    rent,
    transactionType,
    propertyType,
    viewStatus,
    navigation,
}) {
    return (
        <View style={styles.card}>

            {/* Image Container */}
            <View style={styles.imageContainer}>
                {
                    propertyImg ? 
                        <Image
                            source={{ uri: propertyImg }}
                            style={{ width:'100%', height:'100%'}}
                            resizeMode='stretch'
                        />
                    :
                    <Image
                        source={require('../../assets/images/nommage.jpg')}
                        style={{ width:'100%', height:'100%'}}
                        resizeMode='contain'
                    />
                }
            </View>

            {/* Property Details such as Property type and price etc. */}
            <View style={styles.detailsContainer}>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%', alignItems:'center', marginBottom:10}}>
                <Text style={styles.houseName}>{shortenAddress(houseName)}</Text>
                <TouchableOpacity>
                        {
                            viewStatus === "Inconsidration" ?
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 10, fontWeight: '500', color: "#002AFF", marginRight: 10}}>In-considration</Text>
                                    <Image source={require('../../assets/images/consideraccept.png')} />
                                </View>
                            :
                            viewStatus === "Accepted" ?
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{fontSize: 10, fontWeight: '500', color: "#1AFF55", marginRight: 10}}>Accepted</Text>
                                    <Image source={require('../../assets/images/accept.png')} />
                                </View>
                            :
                            viewStatus === "Rejected" ?
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 10, fontWeight: '500', color: "#8068F7", marginRight: 10}}>Rejected</Text>
                                    <Image source={require('../../assets/images/reject.png')} />
                                </View>
                            :
                                <Image source={require('../../assets/images/nonvisibility.png')} />
                        }

                    </TouchableOpacity>
                </View>
                <Text style={styles.houseAddress}>{cityName}, {societyName}</Text>
                <Text style={styles.houseAddress}>{propertyType}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', marginTop: 10,alignItems:'center' }}>
                    <Icon
                        name='bed'
                        color='#7D7F88'
                        size={14}
                    />
                    <Text style={styles.houseAddress}>{rooms} Rooms</Text>
                    <Icon
                        name='home'
                        color='#7D7F88'
                        size={14}
                    />
                    <Text style={styles.houseAddress}>{area +" "+ areatype}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%',alignItems:'center',marginBottom:10,}}>
                    <Text style={styles.houseRent}>Rs. {rent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    {
                        transactionType == "Sale" ? 
                            <Text style={styles.rentType}></Text>
                        :
                        <Text style={styles.rentType}>/ month</Text>
                    }
                    </Text>

                    <TouchableOpacity onPress={navigation} style={styles.btn}>
                        <Text style={{fontSize: 9, color: "#7D7F88"}}>Make Deal</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </View>
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
        // height: 150,
        elevation: 2,
        borderRadius: 10,
        overflow: 'hidden',
        flex: 1
    },
    imageContainer: {
        width: '25%',
        alignItems:'center',
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
    rating:{
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
        flex:1,
        marginLeft:3
        // marginTop: 5
    },
    houseRent: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 18,
        fontStyle: 'normal',
        marginTop: 10,
        marginBottom: 2
        // alignSelf:'flex-end'
    },
    rentType: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal'
    },

    btn: {
        width: 70, 
        height: 30, 
        backgroundColor: "#F0F0F1", 
        borderRadius: 4, 
        borderWidth: 0.8, 
        borderColor: "#E3E3E7", 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: 5
}
})