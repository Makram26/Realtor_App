import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Image, Dimensions, TouchableOpacity, Text, ActivityIndicator } from 'react-native'

const windowHeight = Dimensions.get('window').height;
import LinearGradient from 'react-native-linear-gradient';

export default function SplashScreen({ navigation }) {
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        // setTimeout(() => setShow(true), delay * 1000);
        let timer1 = setTimeout(() => {
            navigation.navigate("Welcome")
            setLoading(false)
        }, 3000);

        return () => {
            clearTimeout(timer1);
        };
    }, []);

    return (
        <View style={{ flex: 1 }} >
            <LinearGradient colors={['#6986E2', '#4B52DB']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }} >
                {/* <View style={{ backgroundColor: "#fff", width: 90, height: 90, borderTopLeftRadius: 30, borderTopRightRadius: 30, borderTopStartRadius:40, alignItems:'center', justifyContent:'center' }}>
                    <Image
                        source={require('../assets/images/Logo.png')}
                        style={{width:60, height:60,alignSelf:'center'}}
                    />
                </View> */}
                <Image
                    source={require('../assets/images/RealtorLogo.png')}
                    style={{width:84, height:95,alignSelf:'center'}}
                />
                {/* <Image
                    source={require('../assets/images/Triangle.png')}
                >
                    <Image
                        source={require('../assets/images/Logo.png')}
                        style={{width:60, height:60,alignSelf:'center'}}
                    />
                </Image> */}
                <Text style={{ color: "#fff", fontSize: 39, fontWeight:'400', fontFamily:'NTF-Grand', marginTop:-10 }}>Realtor</Text>
                {/* {
                    loading ?
                        <ActivityIndicator style={{ marginTop: -100 }}
                            size="large"
                            color="red"
                        />
                    :
                        null
                } */}

            </LinearGradient>


        </View>
    )
}

