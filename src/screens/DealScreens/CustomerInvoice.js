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
import { AuthContext } from '../../auth/AuthProvider'
import Spinner from 'react-native-loading-spinner-overlay';
import firestore from '@react-native-firebase/firestore'

const INVOICE_NUMBER = Math.floor(Math.random() * 90000) + 10000;
const date = new Date().toLocaleDateString();

// Date 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CustomerInvoice({ route, navigation }) {
    const { user } = useContext(AuthContext);
    const { Name, Detail, Commission, accountType, type, businessID, } = route.params;
    console.log('Name :', Name, "Detail", Detail, "type :", type, 'businessID :', businessID, "accountType", accountType)
    console.log("INVOICE_NUMBER", INVOICE_NUMBER)

    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState(0)
    const [paidAmount, setPaidAmount] = useState(0)

    // const Names = items.Name;
    // const Details = items.Detail

    // Date
    let today = new Date().toLocaleDateString()
    const [todaydate, setTodayDate] = useState(new Date(today));
    let selectdate = new Date(today)
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        setShow(false);
        selectdate = selectedDate
        const currentDate = selectedDate;
        setTodayDate(currentDate)
        checkPermissions2()
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };



    const createInvoice = async () => {
        setLoading(true)
        try {
            await firestore()
                .collection('Invoice')
                .add({
                    user_id: user.uid,
                    invoiceNo: INVOICE_NUMBER,
                    date: todaydate.toLocaleDateString(),
                    customerName: Name,
                    description: Commission,
                    propertyDetail: Detail,
                    totalAmount: Commission,
                    dueAmount: Commission,
                    paidAmount: paidAmount,
                    accountType: accountType,
                    businessID: type == "own" ? businessID : user.uid,
                    role: type,
                    name: user.displayName,

                    timestamp: firestore.Timestamp.fromDate(new Date()),
                })
                .then(() => {
                    // Alert.alert(
                    //     "Deal Done",
                    //     //"Image and Data has been uploaded successfully!"
                    // )
                    setLoading(false)
                    setDescription("")
                    // setPropertyDetail("")
                    setAmount('')
                    navigation.navigate("Invoices")

                    // navigation.pop(2)
                })

        } catch (err) {
            console.log(err)
            setLoading(false)
        }
        // } else {
        //     Alert.alert(
        //         "Notice",
        //         "Please fill Commission first ..."
        //     )
        //     setLoading(false)
        // }
    }


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
                    <Text style={HeaderStyle.HeaderText}>Customer Invoice</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: user.photoURL }} />
                </View>
            </View>

            <View style={{ width: '90%', alignSelf: 'center', flex: 1, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.textTitle}>Invoice # : </Text>
                        <Text style={styles.textHeading}> {INVOICE_NUMBER} </Text>
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


                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: '#1A1E25' }}>Customer Name</Text>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#7D7F88', marginTop: 12, }}>{Name}</Text>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 12 }} />

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: '#1A1E25' }}>Description</Text>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#7D7F88', marginTop: 12, }}>{Commission} PKR</Text>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 12 }} />

                {/* <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textTitle, { marginTop: 20 }]}>
                        Description
                        <Text style={{color:'red'}}> *</Text>
                    </Text>
                </View>
                <TextInput
                    keyboardType='default'
                    style={styles.inputStyle}
                    placeholder=' Enter description'
                    placeholderTextColor={"#A1A1A1"}
                    value={description}
                    onChangeText={(value) => setDescription(value)}
                /> */}

                <Text style={[styles.textTitle, { marginTop: 20 }]}>
                    Property Detail
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '400', color: '#7D7F88', marginTop: 12, }}>
                    {Detail}
                </Text>
                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 10 }} />

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: '#1A1E25' }}>Amount </Text>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#7D7F88', marginTop: 12, }}>{Commission} PKR</Text>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 12 }} />

                {/* <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textTitle, { marginTop: 20 }]}>
                        Amount
                        <Text style={{color:'red'}}> *</Text>
                    </Text>
                </View>
                <TextInput
                    keyboardType='numeric'
                    style={styles.inputStyle}
                    placeholder=' Enter Amount'
                    placeholderTextColor={"#A1A1A1"}
                    value={amount}
                    onChangeText={(values) => setAmount(values)}
                /> */}

                <View style={{ flex: 1, justifyContent: 'flex-end', }}>
                    <TouchableOpacity
                        onPress={() => createInvoice()}
                        style={styles.button}>
                        <Text style={styles.btnText}>Create Invoice</Text>
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
    }
})