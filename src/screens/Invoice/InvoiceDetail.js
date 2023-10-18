import React, { useState, useEffect, useContext } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ActivityIndicator,
    ImageBackground,
    FlatList,
    ScrollView,
    Dimensions,
    BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/FontAwesome'
import Forward from "react-native-vector-icons/Fontisto"
import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
import firestore from '@react-native-firebase/firestore'
import Spinner from 'react-native-loading-spinner-overlay';

// Date 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import DateTimePicker from '@react-native-community/datetimepicker';
import PlaceRow from '../../components/PlaceRow';

export default function InvoiceDetail({ route, navigation }) {
    const { user } = useContext(AuthContext);
    const items = route.params;
    console.log("Payment", items)
    const {invoiceNo, date, customerName, commission, propertyDetail, totalAmount, dueAmount, paidAmount, accountType } = items
    const [loading, setLoading] = useState(false)

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }

            {/* Header */}
            <View style={HeaderStyle.mainContainer}>
                <View style={HeaderStyle.arrowbox}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="left" color="#1A1E25" size={20} />
                    </TouchableOpacity>
                </View>
                <View style={HeaderStyle.HeaderTextContainer}>
                    <Text style={HeaderStyle.HeaderText}>Invoice Detail</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: user.photoURL }} />
                </View>
            </View>

            {/* Body */}
            <View style={{ flex: 1, width: '94%', alignSelf: 'center', }}>

                {/* Invoice and Date Card */}
                <View style={styles.invoiceContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={[styles.textHeading, { width: "50%" }]}>Info</Text>
                        <Text style={[styles.textHeading, { width: "30%", }]}>Date</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={[styles.textTitle, { width: "50%" }]}>Invoice#{invoiceNo}</Text>
                        <Text style={[styles.textTitle, { width: "30%", }]}>{date}</Text>
                    </View>
                </View>

                <View style={styles.mainConatiner}>
                    {
                        accountType === "Supplier" ?
                            <Text style={styles.textHeading}>
                                Supplier Name
                            </Text>
                            :
                            <Text style={styles.textHeading}>
                                Customer Name
                            </Text>
                    }
                    <Text style={styles.textTitle}>{customerName} </Text>
                    <View style={styles.line} />

                    <Text style={styles.textHeading}>Description</Text>
                    <Text style={styles.textTitle}>{propertyDetail}</Text>
                    <View style={styles.line} />

                    <Text style={styles.textHeading}>Commission of deal</Text>
                    <Text style={styles.textTitle}>{commission}</Text>
                    <View style={styles.line} />

                    {/* Payments */}
                    <View style={styles.paymentSubView}>
                        <Text style={styles.amountHeading}>Total Amount</Text>
                        <View style={styles.amountContainer}>
                            {/* <Image source={require("../../assets/icons/arrowIconw.png")}  style={{ width: 30, marginHorizontal: 15}}/> */}
                            <Forward name="arrow-right-l" size={20} color={"#fff"} style={{ width: 30, marginHorizontal: 15 }} />
                            <Text style={styles.textAmount}>{totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} PKR</Text>
                        </View>
                    </View>
                    <View style={[styles.paymentSubView, { marginTop: 20 }]}>
                        <Text style={styles.amountHeading}>Paid Amount</Text>
                        <View style={styles.amountContainer}>
                            {/* <Image source={require("../../assets/icons/arrowIconw.png")}  style={{ width: 30, marginHorizontal: 15}}/> */}
                            <Forward name="arrow-right-l" size={20} color={"#fff"} style={{ width: 30, marginHorizontal: 15 }} />
                            <Text style={styles.textAmount}>{paidAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} PKR</Text>
                        </View>
                    </View>
                    <View style={[styles.paymentSubView, { marginTop: 20 }]}>
                        <Text style={styles.amountHeading}>Due Amount</Text>
                        <View style={styles.amountContainer}>
                            {/* <Image source={require("../../assets/icons/arrowIconw.png")}  style={{ width: 30, marginHorizontal: 15}}/> */}
                            <Forward name="arrow-right-l" size={20} color={"#fff"} style={{ width: 30, marginHorizontal: 15 }} />
                            <Text style={styles.textAmount}>{dueAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} PKR</Text>
                        </View>
                    </View>

                    <View style={{flex: 1, justifyContent:'center'}}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate("Payment", items)}>
                            <Text style={styles.btnText}>Get Payment</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    invoiceContainer: {
        flex: 0.05,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        elevation: 3,
        paddingRight: 20,
        marginTop: 20,
    },
    textHeading: {
        fontSize: 12,
        fontWeight: "400",
        lineHeight: 15,
        color: '#000000',
        marginTop: 20,
        paddingLeft: 20,
    },
    textTitle: {
        fontSize: 14,
        fontWeight: "400",
        lineHeight: 17,
        color: '#000000',
        marginTop: 7,
        paddingLeft: 20,
    },

    mainConatiner: {
        flex: 0.3,
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 5,
        marginTop: 20
    },

    amountHeading: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 17,
        color: "#000",
        paddingLeft: 20,
        marginTop: 10,
        width: "40%"
    },

    paymentSubView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },

    line: {
        width: "98%",
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: "#E2E2E2",
        marginTop: 2,
    },
    amountContainer: {
        width: "40%",
        backgroundColor: "#000",
        flexDirection: 'row',
        alignItems: 'center',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
    },
    textAmount: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 17,
        color: '#DDDDDD',
        paddingVertical: 8,
        width: "55%"
    },

    button: {
        backgroundColor: "#917AFD",
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 10,
        justifyContent: 'flex-end',
        width: "40%",
        alignSelf: 'center'
    },
    btnText: {
        textAlign: 'center',
        color: 'white',
        margin: 15,
    }

})