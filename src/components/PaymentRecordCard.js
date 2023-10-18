import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { shortenAddress } from '../functions/shortenAddress'

export default function PaymentRecordCard({
    customerName,
    totalAmount,
    dueAmount,
    paidAmount,
    invoiceNo,
    date,
    commission,
    navigation,
}) {
    console.log("Due Amount", typeof dueAmount)
    return (
        <View style={styles.mainContainer}>
            <TouchableOpacity onPress={navigation}>
                {/* <View style={styles.underline} /> */}
                <View style={styles.upperContainer}>
                    <Text style={styles.nameText}>{customerName}</Text>
                    <Text style={[styles.mobileText]}><Text style={{ fontWeight: "bold", color: '#000' }}>Date:</Text> {date}</Text>
                </View>

                <View style={styles.centerContainer}>
                    <Text style={[styles.mobileText, {textAlign:'left'}]}><Text style={{ fontWeight: "bold", color: '#000' }}>Invoice #:</Text> {invoiceNo}</Text>
                    <Text style={[styles.mobileText, { color: '#000', fontWeight: 'bold' }]}>Paid :
                        <Text style={{ color: "#8169F7", fontWeight: '400' }}>
                        {paidAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") } PKR
                        </Text>
                    </Text>
                </View>

                <View style={styles.lowerContainer}>
                    <Text style={[styles.mobileText, {textAlign:'left'}]}><Text style={{ fontWeight: "bold", color: '#000' }}>Detail :</Text> {commission}</Text>
                    <Text style={[styles.mobileText, { color: '#000', fontWeight:'bold'}]}>Total :
                        <Text style={{ color: "#8169F7", fontWeight:'400' }}>
                            {totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} PKR
                            {/* {transactionType == "Let" ? " /Month" : null} */}
                        </Text>
                    </Text>
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
        marginTop: 20,
        marginBottom: 5,
    },

    upperContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
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
        width: "50%"
    },
    nameText: {
        color: "#1A1E25",
        fontSize: 14,
        fontWeight: "600",
        width: "50%"
    },

    centerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
    },

    lowerContainer: {
        // width:"92.3%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
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
