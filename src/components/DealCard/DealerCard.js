import React, {useState} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, navigatePress, } from 'react-native'
import CheckBox from '@react-native-community/checkbox'
import Icon from 'react-native-vector-icons/Ionicons'
export default function DealerCard({
    name,
    phone,
    image,
    onPress,
}) 

{

    const [toggleCheckBox, setToggleCheckBox] = useState(false)


    return (
        <TouchableOpacity style={styles.card} onPress={navigatePress}>

            {/* Dealer Icon Container */}
            <View style={styles.leftContaioner}>
                <Image style={{ height: 75, width: 75, borderRadius: 20 }} source={require('../../assets/images/personpic.png')}/>
            </View>

            {/* Dealer Info Container */}
            <View style={styles.centerContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.phone}>{phone}</Text>
            </View>

            {/* Dealer CheckBox  Container */}
            <View style={styles.rightContainer}>
                <CheckBox
                    disabled={false}
                    value={toggleCheckBox}
                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                    tintColors={{ true: "#917AFD", false: "black" }}
                />
            </View>


            <View style={{ borderWidth: 0.6, marginTop: 20, marginBottom: 10, borderColor: "#D6D6D6" }} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        alignSelf: 'center',
        // borderColor:'red',
        // borderWidth:1,
        marginBottom: 15,
        flexDirection: 'row',
        // padding:5,
        backgroundColor: 'white',
        height: 80,
        elevation: 5,
        borderRadius: 10,
        overflow: 'hidden',
        flex: 1
    },

    leftContaioner: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
    },
    centerContainer: {
        flex: 2,
        alignSelf: "center"
    },
    rightContainer: {
        flex: 1,
        alignSelf: 'center',
        alignContent: 'center',
        alignItems: 'center'
    },
    
    name: {
        color: "#1A1E25",
        fontSize: 14,
        fontWeight: "600",
        letterSpacing: 0.0113,
        width: "75%",
        margin: 3,
    },
    phone: {
        color: "#1A1E25",
        fontSize: 14,
        letterSpacing: 0.0113,
        width: "75%",
        margin: 3,
    },

    
})
