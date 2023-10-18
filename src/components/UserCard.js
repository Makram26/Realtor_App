import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

export default function UserCard({name, onPress, source, contact, disable, type}) {
    return (
        <View style={styles.userRecordContainer}>
            <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
                {/* <Image style={styles.imageStyle} resizeMode='contain' source={source} /> */}
                <Icon 
                    name="md-person-circle-sharp"
                    size={60} color="#282B4E"
                    // style={styles.sellerImage}
                />

                <View style={{ flex: 1, marginLeft: 10, justifyContent:'space-around' }}>
                    <Text style={styles.usernameStyle}>{name}</Text>
                    <View style={styles.lowerContainer}>
                        <Text style={styles.textStyle}>{contact}</Text>
                        <TouchableOpacity 
                            onPress={onPress} 
                            style={{backgroundColor:'#8A73FB', width:'20%',height:25,alignItems:'center',justifyContent:'center',borderRadius:5,elevation:2,marginRight:10}}
                        >
                            <Text style={{color:'white',fontSize:12,fontFamily:'Roboto',fontWeight:'500'}}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={disable} 
                            style={{borderColor:'#8A73FB', borderWidth:1, width:'20%',height:25,alignItems:'center',justifyContent:'center',borderRadius:5,elevation:2, backgroundColor:'white'}}
                        >
                            {
                                type == "Active" ?
                                <Text style={{color:'#8A73FB',fontSize:12,fontFamily:'Roboto',fontWeight:'500'}}>Disable</Text>
                                :<Text style={{color:'#8A73FB',fontSize:12,fontFamily:'Roboto',fontWeight:'500'}}>Active</Text>
                            }
                            
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
            <View style={{ borderWidth: 0.8, borderColor: "#D6D6D6", marginTop: 17 }} />
        </View>
    )
}

const styles = StyleSheet.create({
    userRecordContainer: {
        width: "92%",
        alignSelf: "center",
    },
    imageStyle: {
        width: 55,
        height: 55
    },
    usernameStyle: {
        color: "#1A1E25",
        fontSize: 14,
        fontWeight: "600",
        letterSpacing: 0.013
    },
    lowerContainer: {
        // flex: 1,
        // marginTop: 10,
        flexDirection: "row",
        alignItems:'center'
        // justifyContent: 'space-between'
    },
    editText: {
        color: "#917AFD",
        fontSize: 14,
        fontWeight: "500",
        letterSpacing: 0.02
    },
    textStyle: {
        flex: 0.9,
        color: "#7D7F88",
        fontSize: 12,
        fontWeight: '400'
    }
})