import { ScaleFromCenterAndroid } from '@react-navigation/stack/lib/typescript/src/TransitionConfigs/TransitionPresets';
import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
export default function RentCard({ item }) {
    function capitalFirstLetter(String) {
        return String.charAt(0).toUpperCase() + String.slice(1);
    }
    return (
        <View style={{ flex: 1, flexDirection: 'row', width: "35%", borderWidth: 1, borderColor: "#EBEBEB", borderRadius: 10, marginRight: RFValue(25) }}>
        <View style={{ flex: 0.3 }}>
            <Image style={{width:RFValue(100),height:RFValue(175)}} resizeMode='contain' source={require('../assets/images/Frame1.png')} />
        </View>

        <View style={{ flex: 0.7, margin: RFValue(10), }}>
            <View style={{ flexDirection: 'row', }}>
                <Icon2 name="star" color="#FFBF75" size={RFValue(15)} />
                <Text style={{ color: "#1A1E25", fontSize: RFValue(12), marginLeft: RFValue(8) }}>4.8</Text>
            </View>

            <Text style={{ color: "#1A1E25", fontSize: RFValue(18), width: "80%", marginTop: RFValue(10) }}>The House Name Goes Here..</Text>
            <Text style={{ color: '#7D7F88', fontSize: RFValue(13) }}>Lahore, Johar Town</Text>
            <View style={{ flexDirection: 'row', marginTop: RFValue(10), alignItems: 'center' }}>
                <Image style={{ tintColor: "#7D7F88", marginTop: RFValue(3) }} resizeMode='contain' source={require('../assets/images/Group2.png')} />
                <Text style={{ color: "#7D7F88", fontSize: RFValue(13), marginLeft: RFValue(4), marginRight: RFValue(10) }}>2 room</Text>
                <Icon3 name="home-export-outline" color="#7D7F88" size={RFValue(20)} />
                <Text style={{ color: "#7D7F88", fontSize: RFValue(13), marginLeft: RFValue(4) }}>673 m2</Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: RFValue(10), alignItems: 'center', justifyContent: 'space-between', width: "80%", }}>
                <Text style={{ color: "#1A1E25", fontSize: RFValue(16), fontWeight: "bold" }}>$526 / month</Text>
                <Icon2 name="hearto" color="#7D7F88" size={RFValue(20)} />

            </View>
        </View>

    </View>
    )
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        // backgroundColor: Colors.primary
    },
    cardContainer: {
        backgroundColor: 'white',
        padding: 10,
        width: '95%',
        alignSelf: 'center',
        borderRadius: 15,
        marginTop: 5,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 1, width: 1 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        elevation: 9
    }
})
