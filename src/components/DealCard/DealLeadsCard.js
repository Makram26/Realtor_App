import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
export default function DealLeadsCard({
    name,
    mobile,
    notes,
    size,
    sizeType,
    navigation,
    houseName,
    societyName,
    city,
}) {
    return (
        <View style={styles.mainContainer}>
            {/* <View style={styles.underline} /> */}
            <View style={styles.upperContainer}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={[styles.mobileText]}>{mobile}</Text>
            </View>
            <Text  style={{fontSize: 14, fontWeight:'400', marginLeft: 15,width:"93.5%"}}>{societyName}</Text>
            <View style={styles.lowerContainer}>
                <Text style={styles.textStyle}>{size} {sizeType}</Text>
                    <TouchableOpacity
                        style={styles.ViewinventryBtn} onPress={navigation}>
                        <Text style={styles.inventryText}>View Inventory</Text>
                    </TouchableOpacity>
            </View>
            <View style={{ borderWidth: 1, borderColor: "#E2E2E2", width: "92%", alignSelf: 'center'}} />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: "98%",
        // height: 80,
        alignSelf: 'center',
        marginTop: 5,
    },
    underline: {
        borderWidth: 0.6,
        margin: 15,
        marginTop: 8,
        borderColor: "#D6D6D6"
    },
    upperContainer: {
        flex:1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 15,
        marginRight: 15

    },
    textStyle: {
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "400",
        marginTop: 8,
        width:"55%"
    },
    mobileText:{
        flex:0.3,
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "400",
        textAlign:"right",
    },
    nameText: {
        flex:0.7,
        color: "#1A1E25",
        fontSize: 14,
        fontWeight: "600",
        
    },
    lowerContainer: {
        flex:1,
        width:"92.3%",
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 15,
        marginRight: 15,
    },
    ViewinventryBtn:
    {
        backgroundColor: "#F2F2F3",
        borderRadius: 5,
        borderWidth: 0.8,
        borderColor: "#E3E3E7",
        width: "30%",
        height: 30,
        marginBottom: 10,
        marginLeft:10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inventryText: {
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "normal",
        padding: 5
    }

})
