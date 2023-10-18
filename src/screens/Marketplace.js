import React, {useContext} from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'

import { HeaderStyle } from '../constants/Styles'
import { AuthContext } from '../auth/AuthProvider'

import Icon from 'react-native-vector-icons/AntDesign';

const Header = ({goBack, profile}) => {
    return (
        <View style={HeaderStyle.mainContainer}>
            <View style={HeaderStyle.arrowbox}>
                <TouchableOpacity onPress={goBack}>
                    <Icon name="left" color="#1A1E25" size={20} />
                </TouchableOpacity>
            </View>

            <View style={HeaderStyle.HeaderTextContainer}>
                <Text style={HeaderStyle.HeaderText}>Marketplace</Text>
                <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: profile }} />
            </View>
        </View>
    )
}

export default function Marketplace({navigation}) {
    const { user } = useContext(AuthContext);

    return (
        <View style={styles.screen}>
            <Header
                goBack={()=>navigation.goBack()}
                profile={user.photoURL}
            />

            <Text style={styles.text}>
                Coming Soon....
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:'white'
    },
    text:{
        fontSize:30,
        fontFamily:'Lato',
        letterSpacing:1,
        marginTop:'50%',
        color:'#7F66F6',
        fontWeight:'700',
        lineHeight:100,
        alignSelf:'center'
    }
})