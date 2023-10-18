import React from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import Icon1 from 'react-native-vector-icons/AntDesign';

import { HeaderStyle } from '../../constants/Styles';

export default function HeaderDeal({ filterPress, goBackPress, propertyImg, ...otherprops }) {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.menu} onPress={goBackPress}>
                <Icon1
                    name='left'
                    color='#1A1E25'
                    size={22}
                />
            </TouchableOpacity>
            <Text style={HeaderStyle.HeaderText}>View Inventory</Text>
            <TouchableOpacity onPress={filterPress}>
                <Image
                    style={HeaderStyle.HeaderImage}
                    resizeMode='contain'
                    // source={require('../../assets/images/personpic.png')} 
                    // source={{ uri: user.photoURL }} 
                    source={{ uri: propertyImg }}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '95%',
        alignSelf: 'center',
        // borderColor:'red',
        // borderWidth:1,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    heading:{
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1E25',
        marginLeft: 10,
        marginTop: 5,
    },
    menu: {
        height: 34,
        width: 34,
        borderRadius: 10,
        borderColor: '#E3E3E7',
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FDFDFD',
        elevation: 9
    },
    searchbar: {
        width: '65%',
        alignSelf: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'red',
        // borderWidth:1,
        backgroundColor: 'white',
        borderRadius: 20,
        height: 48
        // justifyContent:'center'
    },
    searchbarPlaceholder: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        // marginTop: 10,
        // borderColor:'green',
        // borderWidth:1,
        lineHeight: 15,
        marginLeft: 5,
        // alignItems:'center',
        // alignSelf:'center',
        // width:'100%'
        flex: 1
    },
    filter: {
        width: 48,
        height: 48,
        borderRadius: 10,
        borderColor: '#E3E3E7',
        borderWidth: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#917AFD',
        elevation: 9
    }
})