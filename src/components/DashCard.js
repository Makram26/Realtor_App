import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default function DashCard({
    onPress,
    source,
    name
}) {
    return (
        <TouchableOpacity style={styles.Products_Check} onPress={onPress}>
            <View style={styles.Products_Check_Image}>
                <Image
                    source={source}
                    style={styles.product_container_logo}
                    resizeMode="contain"
                />
                <View style={{ marginVertical: RFValue(5), alignItems: 'center' }}>
                    <Text style={{ alignSelf: 'center', fontSize:RFValue(12), fontWeight: '700', color: '#A0A0A0' }}>
                        {name}
                    </Text>
                </View>
            </View>

        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    Products_Check: {
        // height: 80,
        width:RFPercentage (15),
       marginLeft: RFValue(10),
        marginRight: RFValue(10),
        marginVertical: RFValue(10),
       
    },
    Products_Check_Image: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 10,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        // backgroundColor: '#fff',
        elevation: 20, // Android
    },
    product_container_logo: {
        width: '40%',
        height: RFValue(50),
        alignSelf: 'center',
        tintColor:"#3827B4"
    },
})
