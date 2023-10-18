import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons'

const photo = "https://lh3.googleusercontent.com/a/AATXAJx_WjrG0d45gtXkEMDKfZVOnZuJZLtNkPbRtl23=s96-c"

const Header = () => {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerIconContainer}>
                <Icon
                    name='chevron-back-outline'
                    color="black"
                    size={25}
                />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerText}>Deal Details</Text>
            </View>
            <Image
                style={{ width: 30, height: 30, borderRadius: 50 }} resizeMode='contain'
                //source={user.photoURL}
                source={{ uri: photo }}
            />
        </View>
    )
}

const Border = () => {
    return (
        <View style={{borderColor:'#E2E2E2B2',borderWidth:1,marginVertical:7}}/>
    )
}

export default function DealDetails() {
    return (
        <View style={styles.screen}>
            <Header/>
            <View style={styles.body}>
                <Text style={styles.title}>Title</Text>
                <Text style={styles.date}>Date</Text>
                <Border/>

                <Text style={styles.title1}>Deal Amount</Text>
                <Text style={styles.commission}>Date</Text>
                <Border/>

                <Text style={styles.title1}>Buyer Commission</Text>
                <Text style={styles.commission}>Date</Text>
                <Border/>

                <Text style={styles.title1}>Seller Commission</Text>
                <Text style={styles.commission}>Date</Text>
                <Border/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex:1,
        backgroundColor:'#FCFCFC'
    },
    header: {
        flexDirection: 'row',
        width: '95%',
        alignSelf: 'center',
        // borderColor: 'red',
        // borderWidth: 1,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerIconContainer: {
        backgroundColor: '#FDFDFD',
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#E3E3E7',
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 7
    },
    headerText: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 21,
        color: '#404040'
    },
    body: {
        width: '95%',
        borderColor:'red',
        alignSelf:'center',
        borderWidth:1,
        marginTop:'10%'
    },
    title: {
        fontSize:16, 
        fontFamily:'Lato', 
        fontWeight:'900',
        color:'black'
    },
    title1: {
        fontSize:16, 
        fontFamily:'Lato', 
        fontWeight:'900',
        color:'black',
        marginTop:8
    },
    date: {
        fontSize:14, 
        color:'#A1A1A1', 
        fontWeight:'500',
        fontFamily:'Lato',
        marginTop:7
    },
    commission:{
        fontSize:14, 
        color:'#A1A1A1', 
        fontWeight:'500',
        fontFamily:'Lato',
        marginTop:7,
        alignSelf:'flex-end'
    }
})