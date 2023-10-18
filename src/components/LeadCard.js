import React, {useEffect, useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'


import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LeadCard({
    name,
    mobile,
    size,
    sizeType,
    navigation,
    goTo,
    property,
    notes,
    houseNo,
    budget 
}) {

    const [countryID, setCountryID] = useState('')

    useEffect(() => {
        getCurrency()
    }, [])

    const getCurrency = async() => {
        var country = await AsyncStorage.getItem("@country");
        setCountryID(country)
    }

    return (
        <TouchableOpacity style={styles.mainContainer} onPress={goTo}>
            {/* <View style={{width:'16%',alignItems:'center'}}>
                <Icon
                    name='user-circle'
                    color="#826AF7"
                    size={50}
                />
            </View> */}
            <View style={{width:'95%',backgroundColor:'white', elevation:4, borderRadius:5,alignSelf:'center'}}>
                <View style={styles.upperContainer}>
                    <Text style={styles.nameText}>{name}</Text>
                    <Text style={[styles.mobileText]}>{mobile}</Text>
                </View>
                
                <View style={styles.lowerContainer1}>
                    {
                        houseNo !== "" ?
                            <Text  numberOfLines={1} style={styles.textStyle1}>{houseNo}, {notes}</Text> 
                        : 
                            <Text numberOfLines={1} style={styles.textStyle1}>{notes}</Text>
                    }
                    
                </View>
                <View style={styles.lowerContainer}>
                    <Text style={styles.textStyle}>
                        {countryID == "UAE" ? "AED " : countryID == "India" ? "INR " : countryID == "Bangladesh" ? "BDT " : "PKR "}
                        {/* {countryID == 2 ? "AED " : countryID == 3 ? "INR " : countryID == 4 ? "BDT " : "PKR "}  */}
                        {budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }{property === "ToLet" || property === "Rent"? "/month":""}
                    </Text>
                    {
                        property == "Sale" || property == "ToLet" ?
                        <View style={{alignSelf:'flex-end',marginRight:10}}>
                            <Text style={styles.textStyle1}>{size} {sizeType}</Text> 
                        </View> 
                        :
                        <TouchableOpacity
                            style={styles.ViewinventryBtn} onPress={navigation}>
                            <Text style={styles.inventryText}>View Inventory</Text>
                        </TouchableOpacity>
                        
                    }
                </View>
            </View>
            
            {/* <View style={{ borderWidth: 1, borderColor: "#E2E2E2", width: "92%", alignSelf: 'center'}} /> */}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: "98%",
        height: 115,
        // alignSelf: 'center',
        marginTop: 10,
        // flexDirection:'row',
        // alignItems:'center',
        marginBottom:10
    },
    underline: {
        borderWidth: 0.6,
        margin: 15,
        marginTop: 8,
        borderColor: "#D6D6D6"
    },
    upperContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 15,
        marginRight: 15,
        marginTop:10
    },
    textStyle1: {
        color: "#7D7F88",
        fontSize: 15,
        fontWeight: "500",
        // marginTop: 8,
        width:"100%"
    },
    textStyle: {
        color: "#7D7F88",
        fontSize: 14,
        fontWeight: "500",
        // marginTop: 8,
        width:"55%"
    },
    mobileText:{
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: "400",
        textAlign:"right",
        // marginRight:5
    },
    nameText: {
        color: "#1A1E25",
        fontSize: 15,
        fontWeight: "600",
        width:"72%"
    },
    lowerContainer1: {
        width:"90%",
        // flexDirection: "row",
        marginTop: 3,
        justifyContent: "space-between",
        marginLeft: 15,
        // marginRight: 15,
    },
    lowerContainer: {
        width:"95%",
        flexDirection: "row",
        marginTop: 10,
        justifyContent: "space-between",
        alignItems:'center',
        marginLeft: 15,
        marginRight: 15,
        marginBottom:10
    },
    ViewinventryBtn:
    {
        backgroundColor: "#F2F2F3",
        borderRadius: 5,
        borderWidth: 0.8,
        borderColor: "#E3E3E7",
        width: "30%",
        height: 30,
        marginRight: 3,
        // marginBottom: 10,
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
