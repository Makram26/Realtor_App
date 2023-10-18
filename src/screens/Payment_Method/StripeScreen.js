import React, { useState, useEffect,useContext } from 'react'
import { StyleSheet, Text, View, SafeAreaView, Button, Image, Alert, BackHandler } from 'react-native'

import { CardField, StripeProvider, useStripe, CardForm, } from '@stripe/stripe-react-native'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../../auth/AuthProvider'

import Spinner from 'react-native-loading-spinner-overlay';

const StripeScreen = ({userCount, navigation}) => {
    const [cardDetails, setCardDetails] = useState(null)
    const { confirmPayment, initPaymentSheet, presentPaymentSheet } = useStripe();
    const stripe = useStripe();
    const [key, setKey] = useState('')
    const { user } = useContext(AuthContext);

    const [count, setCount] = useState(userCount)

    const[loading, setLoading] = useState(false)

    const [cardRecord,setCardRecord]=useState("")

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
        return () => backHandler.remove()
    }, [])

    console.log(">>>>>>>>>>>>>>>>>>",cardRecord.complete)

    const newSubscription = async () => {
        if(cardRecord.complete == true ){

        
        setLoading(true)
        try {
            const response = await fetch("http://18.142.162.227:5000/subscription", {
                method: "POST",
                body: JSON.stringify({ email: user.email, userCount: userCount }),
                headers: {
                  "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            console.log("data", data)
            if (!response.ok) {
                setLoading(false)
                Alert.alert(data.message);
            }
            const clientSecret = data.clientSecret;
            const status = data.status
            console.log("clientSecret=>>>>>", clientSecret)
            console.log("status=>>>>>", status)
            // handlePayment(clientSecret)

            if (status === 'requires_action') {
                stripe.confirmPayment(clientSecret).then(function(result) {
                    if (result.error) {
                        setLoading(false)
                        console.log('There was an issue!');
                        console.log(result.error);
                        Alert.alert(result.error)
                        // Display error message in your UI.
                        // The card was declined (i.e. insufficient funds, card has expired, etc)
                    } else {
                        setLoading(false)
                        console.log('You got the money!');
                        Alert.alert("Payment Succesfull",`Your card has successfully been charged for $${userCount*2.5}`)
                        navigation()
                        // Show a success message to your customer
                    }
                });
            } else {
                setLoading(false)
                console.log('You got the money!');
                Alert.alert("Payment Succesfull",`Your card has successfully been charged for $${userCount*2.5}`)
                navigation()
                // No additional information was needed
                // Show a success message to your customer
            }
        } catch (error) {
            setLoading(false)
            console.error(error);
        }
    }
    else{
        alert("Please fill all mandatory field!")
    }
    }

    const newPayment = async () => {
        try {
            const response = await fetch("http://192.168.70.147:5000/create-payment-intent", {
                method: "POST",
                body: JSON.stringify({ userCount: userCount }),
                headers: {
                  "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (!response.ok) return Alert.alert(data.message);
            const clientSecret = data.clientSecret;
            const status = data.status
            console.log("clientSecret=>>>>>", clientSecret)
            console.log("status=>>>>>", status)
            // handlePayment(clientSecret)

            if (status === 'requires_action') {
                stripe.confirmPayment(clientSecret).then(function(result) {
                  if (result.error) {
                    console.log('There was an issue!');
                    console.log(result.error);
                    // Display error message in your UI.
                    // The card was declined (i.e. insufficient funds, card has expired, etc)
                  } else {
                    console.log('You got the money!');
                    // Show a success message to your customer
                  }
                });
              } else {
                console.log('You got the money!');
                // No additional information was needed
                // Show a success message to your customer
            }
        } catch (error) {
            console.error(error);
        }
        // console.log("userCount=>>>>", userCount)
        // // const data = { count: userCount}
        // await fetch('http://192.168.70.147:5000/create-payment-intent', {
        //     method: 'POST',
        //     body: count,
        //     headers: {
        //         'Content-Type': 'application/json'
        //         // 'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        // })
        //     // .then(res => console.log("res=>>",res))
        //     .then(res => res.json())
        //     .then(res => {
        //         console.log(res)
        //         const clientSecret = res.clientSecret;
        //         // alert(clientSecret)
        //         // setKey(clientSecret)
        //         // initPaymentSheet({paymentIntentClientSecret: key});
        //         handlePayment(clientSecret)
        //     })
        //     .catch(e => alert(e.message))
    }

    // useEffect(() => {
    //     console.log("userCount=>>>>", userCount)
    //     // const data = { count: userCount}
    //     fetch('http://192.168.70.147:5000/create-payment-intent', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //             // 'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         body: JSON.stringify(userCount)
    //     })
    //         // .then(res => console.log("res=>>",res))
    //         .then(res => res.json())
    //         .then(res => {
    //             console.log(res)
    //             const clientSecret = res.clientSecret;
    //             // alert(clientSecret)
    //             setKey(clientSecret)
    //             initPaymentSheet({paymentIntentClientSecret: key});
    //         })
    //         .catch(e => alert(e.message))
    // }, [])

    const handlePayment = async (key) => {
        console.log("key", key)
        if(key){
            const { error, paymentIntent } = await stripe.confirmPayment(key, {
                paymentMethodType: 'Card',
                billingDetails: {
                    email: "john@doe.com",
                    // name: user.displayName
                }
            });
    
            if (error) {
                console.log(error)
                alert('Error', error)
            }
            else {
                console.log("paymentIntent", paymentIntent)
                var amount = paymentIntent?.amount.toString()
                Alert.alert("Payment Sucessfull", `Billed for Rs. ${amount.substring(0,4)}`)
                navigation()
            }
        }
        
    }

    // const handleSheet = () => {
    //     presentPaymentSheet({
    //       clientSecret: key,
    //     });
    //   };
    

    return (
        <View style={styles.screen}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }
            <Text style={{alignSelf:'center',marginTop:10, fontSize:20, fontWeight:'700',color:'#404040'}}>Payment</Text>
            <View style={{ width: "100%", height: 230 }}>
                <Image
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                    source={{ uri: 'https://africa.visa.com/dam/VCOM/regional/cemea/genericafrica/global-elements/cards/classic.jpg' }}
                />
            </View>
            <CardField
                // postalCodeEnabled={false}
                // style={{ height: 50, width: '100%' }}
                postalCodeEnabled={false}
                placeholders={{
                    number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                    backgroundColor: '#FFFFFF',
                    textColor: '#000000',

                }}
                style={{

                    width: '100%',
                    height: 50,
                    marginVertical: 30,
                }}
                onCardChange={(cardDetails) => {
                    console.log('cardDetails', cardDetails);
                    setCardRecord(cardDetails)
                }}
                onFocus={(focusedField) => {
                    console.log('focusField', focusedField);
                }}
            />

            <Button title='Pay now' onPress={newSubscription} />
            {/* <Button title="Present sheet" onPress={handleSheet} /> */}
        </View>
    )

}

export default StripeScreen

const styles = StyleSheet.create({
    screen: {
        marginTop: 0,
        margin: 10

    }
})