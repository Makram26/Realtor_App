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
import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider';
import firestore from '@react-native-firebase/firestore'
import Spinner from 'react-native-loading-spinner-overlay';

import UserInvoiceRequest from '../../api/UserInvoiceRequest';
import PermissionAPI from '../../api/PermissionsAPIs/checkUserAPI'

import DateTimePicker from '@react-native-community/datetimepicker';

export default function Payment({ route, navigation }) {
    const { user } = useContext(AuthContext);
    const {id, type, businessID, accountType, invoiceNo, date, customerName, commission, propertyDetail, totalAmount, dueAmount, paidAmount, } = route.params

    const [loading, setLoading] = useState(false)
    // const [totalAmount, setTotalAmount] = useState(totalAmount)
    const [amount, setAmount] = useState('')
    const [duesAmount, setDuesAmount] = useState(0)

    // Date
    let today = new Date().toLocaleDateString()
    const [todaydate, setTodayDate] = useState(new Date(today));
    let selectdate = new Date(today)
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    useEffect(() => {
        checkPermissions()
        const unsubscribe = navigation.addListener('focus', () => {
            checkPermissions()
        });
        return () => {
            unsubscribe;
        };
    }, [])

    const checkPermissions = async () => {
        const response = await PermissionAPI.checkUserType(user.uid)
        // console.log("type", response)
        if (response && response == 1) {
            const respone = await PermissionAPI.checkAccessType(user.uid)
            // console.log("access", respone)
            setAccessType(respone)
            ShowInvoiceUser(respone.user_role, respone.businessID)
        }
        else {
            ShowInvoiceUser("business", user.uid)
        }
    }

    // Form Data 
    const onChange = (event, selectedDate) => {
        setShow(false);
        selectdate = selectedDate
        const currentDate = selectedDate;
        setTodayDate(currentDate)
        // checkPermissions2()
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const [actualPrice, setActualPrice] = useState(" Price must contain numbers only")
    const ChangePrice = (e) => {
        var regex = /^[0-9]+$/;
        setDuesAmount(e)
        if (e.match(regex) === null) {
            setActualPrice("Price must contain numbers only")
            return true
        }
        if (e.length < 4) {
            setActualPrice(e)
        }
        else if (e.length > 3 && e.length < 12) {
            setActualPrice("Thousand")
        }
        else {
            setActualPrice("Price is too large. Please enter a smaller number.")
        }
    }


    const updateInvoice = async () => {
        // console.log("Business ID: ", user.uid)
        setLoading(true)
        if(duesAmount > dueAmount){
            Alert.alert(
                "Notice",
                "Amount should be less than Payable/Due Amount"
            )
            setLoading(false)
            return true
        }

        if (duesAmount > 0 ) {
            try {
                await firestore()
                    .collection('Invoice')
                    .doc(id)
                    .update({
                        date: todaydate.toLocaleDateString(),
                        // totalAmount: amount,
                        dueAmount: parseInt(dueAmount) - parseInt(duesAmount) ,
                        paidAmount: parseInt(paidAmount) + parseInt(duesAmount),
                        timestamp: firestore.Timestamp.fromDate(new Date()),
                    })
                    .then(() => {
                        // Alert.alert(
                        //     "Deal Done",
                        //     //"Image and Data has been uploaded successfully!"
                        // )
                        setLoading(false)
                        setDuesAmount(0)
                        // navigation.goBack()

                        if (accountType == "Customer") {
                            navigation.navigate('Invoices')
                        }
                        else {
                            navigation.navigate('SupplierInvoices')
                        }
                    })

            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        } else {
            Alert.alert(
                "Notice",
                "Please enter valid amount..."
            )
            setLoading(false)
        }
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }} keyboardShouldPersistTaps='always'>
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
                    <Text style={HeaderStyle.HeaderText}>Payment</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: user.photoURL }} />
                </View>
            </View>

            <View style={{ width: '90%', alignSelf: 'center', flex: 1, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.textTitle}>Invoice # : </Text>
                        <Text style={styles.textHeading}> {invoiceNo} </Text>
                    </View>

                    {/* Date & Calender */}
                    <TouchableOpacity onPress={() => showDatepicker()} style={{ flexDirection: "row" }}>
                        <Text style={styles.textTitle}>Date : </Text>
                        <Text style={styles.textHeading}>{todaydate.toLocaleDateString()}</Text>
                        <Icon name='calendar' color="#000" size={20} style={{ marginLeft: 12 }} />
                    </TouchableOpacity>
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={todaydate}
                            mode={mode}
                            dateFormat="day dayofweek month"
                            onChange={onChange}
                        />
                    )}
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    {
                        accountType == "Supplier" ?
                            <Text style={[styles.textTitle, { marginTop: 20 }]}>
                                Supplier Name
                            </Text>
                            :
                            <Text style={[styles.textTitle, { marginTop: 20 }]}>
                                Customer Name
                            </Text>
                    }
                </View>
                <Text style={[styles.textHeading, { marginTop: 5 }]}>{customerName} </Text>
                <View style={styles.line} />

                {/* Payable Amount */}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textTitle, { marginTop: 15 }]}>
                        Payable Amount
                    </Text>
                </View>
                <Text style={[styles.textHeading, { marginTop: 5 }]}>{dueAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} PKR</Text>
                <View style={styles.line} />

                {/* Due Amount */}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textTitle, { marginTop: 15 }]}>
                        Amount
                    </Text>
                </View>
                <View style={styles.demandContainer}>
                    <TextInput
                        placeholder='Enter Amount here...'
                        placeholderTextColor="#1A1E25"
                        style={[styles.demandInput, { width: '70%' }]}
                        keyboardType='numeric'
                        value={duesAmount}
                        onChangeText={(val) => ChangePrice(val)}
                    />
                    <Text style={{ color: '#6C51EE', fontFamily: 'Lato', fontWeight: '600', fontSize: 16, marginRight: 10 }}>PKR</Text>
                </View>
                {
                    actualPrice == "Amount must contain numbers only" ?
                        <Text style={{ marginTop: 5, marginLeft: 5 }}>Price must contain numbers only</Text>
                        :
                        <Text style={{ marginTop: 5, marginLeft: 5 }} >{duesAmount.length == 4 ? duesAmount.charAt(0) : duesAmount.length == 5 ? duesAmount.slice(0, 2) : duesAmount.length == 6 ? duesAmount.charAt(0) + "  Lakh and " + duesAmount.slice(1, 3) : duesAmount.length == 7 ? duesAmount.slice(0, 2) + "  Lakh and " + duesAmount.slice(2, 4) : duesAmount.length == 8 ? duesAmount.charAt(0) + "  Crore  " + duesAmount.slice(1, 3) + "  Lakh and  " + duesAmount.slice(3, 5) : duesAmount.length == 9 ? duesAmount.slice(0, 2) + "  Crore  " + duesAmount.slice(2, 4) + "  Lakh and  " + duesAmount.slice(4, 6) : duesAmount.length == 10 ? duesAmount.charAt(0) + "  Arab  " + duesAmount.slice(1, 3) + "  Crore  " + duesAmount.slice(3, 5) + "  Lakh and  " + duesAmount.slice(5, 7) : duesAmount.length == 11 ? duesAmount.slice(0, 2) + "  Arab  " + duesAmount.slice(2, 4) + "  Crore  " + duesAmount.slice(4, 6) + "  Lakh and  " + duesAmount.slice(6, 8) : null} {actualPrice}</Text>
                }




                <View style={{ flex: 1, justifyContent: 'center', }}>
                    <TouchableOpacity
                        onPress={()=> updateInvoice()}
                        style={styles.button}>
                        <Text style={styles.btnText}>Paid</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    textHeading: {
        fontSize: 16,
        fontWeight: "400",
        color: '#000000'
    },
    textTitle: {
        fontSize: 14,
        fontWeight: "900",
        color: '#000000'
    },

    inputStyle: {
        width: "100%",
        textAlign: "left",
        borderBottomWidth: 1,
        borderColor: "#E2E2E2",
        color: "#000000",
        paddingLeft: 0,
        paddingBottom: 0,
        fontSize: 12,
        fontWeight: "500"
    },
    button: {
        backgroundColor: "#917AFD",
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 12,
        // marginTop: 50,
    },
    btnText: {
        textAlign: 'center',
        color: 'white',
        margin: 15,
    },

    buttonAdd: {
        borderRadius: 10,
        marginHorizontal: 15,
    },
    btnTextAdd: {
        textAlign: 'center',
        color: '#917AFD',
    },

    searchRecord: {
        color: 'red',
        // alignSelf: 'center',
        fontWeight: '500',
        // alignItems: 'center',
        fontSize: 12,
    },

    line: {
        width: "100%",
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: "#E2E2E2",
        marginTop: 2,
    },
    demandContainer: {
        backgroundColor: '#F2F2F3',
        borderWidth: 0.8,
        borderColor: '#E3E3E7',
        borderRadius: 12,
        alignItems: 'center',
        height: 48,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    demandInput: {
        color: '#1A1E25',
        fontSize: 16,
        fontFamily: 'Lato',
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginLeft: 15,
        // lex:1,
        width: '90%',
    },

})