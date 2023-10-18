import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { shortenAddress } from '../functions/shortenAddress'

export default function NewUserInvoiceCard({
    name,
    phoneNo,
    email,
    address,
    navigation,
}) {
    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={navigation}>
                {/* <View style={styles.underline} /> */}
                <View style={styles.upperContainer}>
                    <Text style={styles.nameText}>{name}</Text>
                    <View style={{ width: "50%" }}>
                        <Text style={[styles.mobileText]}>{email}</Text>
                    </View>
                </View>

                <View style={styles.lowerContainer}>
                    <View style={{ flexDirection: 'row', width: "50%", marginTop: 7 }}>
                        <Text style={[styles.textStyle, { color: '#84868F' }]}>{address} </Text>
                        {/* <Text style={[styles.textStyle, { color: "#8169F7" }]}>
                            {amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} PKR
                        </Text> */}
                    </View>

                    <Text style={[styles.mobileText]}>{phoneNo}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '92%',
        // height: 77,
        alignSelf: 'center',
        backgroundColor: 'white',
        elevation: 2,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },

    upperContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        width: "95%"
    },
    textStyle: {
        fontSize: 12,
        fontWeight: "400",
        color: '#84868F',
        fontFamily: 'SF Pro Text'
    },
    mobileText: {
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "400",
        textAlign: "right",
        marginRight: 7,
        // width: "50%"

    },
    nameText: {
        color: "#1A1E25",
        fontSize: 14,
        fontWeight: "600",
        width: "50%"
    },

    lowerContainer: {
        // width:"92.3%",
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-between",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        // borderColor:'red',
        // borderWidth:1
    },
    ViewinventryBtn: {
        backgroundColor: "#F2F2F3",
        borderRadius: 5,
        borderWidth: 0.8,
        borderColor: "#E3E3E7",
        width: 97,
        height: 30,
        // marginLeft:10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inventryText: {
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "normal",
        padding: 5
    }

})
