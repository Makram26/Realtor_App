import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, SafeAreaView, Button } from 'react-native'

import { CardField, StripeProvider, useStripe } from '@stripe/stripe-react-native'
import StripeScreen from './StripeScreen'

const index = ({route, navigation}) => {
    const items = route.params
    // console.log("items", items)

    return (
        <StripeProvider publishableKey='pk_test_51I6daCDaR9YeIUZr9tix2ZwP4xxv1c9h0AA6EBaYUwsyVjvTWqHmaSc0cIcs7opojCyvGjyg3miNXEPcMZOzvadU00H06FWKSd'>
            <SafeAreaView>
                <StripeScreen userCount={items} navigation={()=>navigation.goBack()}/>
            </SafeAreaView>
        </StripeProvider>
    )
 
}

export default index

const styles = StyleSheet.create({})