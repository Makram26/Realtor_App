import React from 'react';
import {View, Text, StyleSheet} from 'react-native'

import destStyle from "../constants/DestinationStyle";
import Entypo from 'react-native-vector-icons/Entypo'


export default function PlaceRow({data}){
    // console.log(data);
    return(
        <View style={[destStyle.row]}>


            {/* DropDown rows to show alternate places on Google Map... */}
            <View style={destStyle.iconContiner}>
                 <Entypo name='location-pin' size={25} color={'white'} />
            </View>

            {/* Method #1 only for show Description  of place*/}
            {/* <Text style={destStyle.locationText}>{data.description }</Text> */}


            {/* Method #2  for show name of place from Description */}
            {/* <Text style={destStyle.locationText}>{data.description || data.name }</Text> */}

            <Text style={destStyle.locationText}>{data.description || data.name +',  '+ data.vicinity}</Text>
        </View>
    )
}