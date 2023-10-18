import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default function AlertModal({
    onPress,
    heading,
    body
}) {
    return (
        <View style={{
            flex: 1, backgroundColor: '#ccc', opacity: 0.85, justifyContent: 'center', alignItems: 'center'
        }}>
            <View style={styles.screen}>
                {/* <View style={styles.header}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, alignSelf: 'center' }}>{heading}</Text>
                </View> */}
                <Image
                    style={{width:130, height: 100, alignSelf:'center',marginTop:10}}
                    resizeMode="contain"
                    source={require('../assets/images/Checkbox.png')}
                />
                <Text style={{ color: '#1D1D1D', flex:0.9, alignSelf: 'center', fontSize: 20, marginTop: 20, fontWeight:'500' }}>{body}</Text>
                <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
                    <Text style={{ color: 'white', fontWeight: '600' }}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        // flex:1,
        height: '33%',
        // marginTop: '60%',
        backgroundColor: 'white',
        width: '80%',
        alignSelf: 'center',
        borderRadius: 10,
        elevation: 9,
        alignItems:'center'
        // overflow:'hidden'
    },
    header: {
        backgroundColor: '#38386A',
        padding: 10
    },
    buttonContainer: {
        alignSelf: 'center',
        borderColor: '#6F54F0',
        backgroundColor:'#6F54F0',
        borderWidth: 1,
        marginBottom: 20,
        width: '30%',
        alignItems: 'center',
        padding: 5,
        borderRadius: 5,
       // marginTop: 10
    }
});
