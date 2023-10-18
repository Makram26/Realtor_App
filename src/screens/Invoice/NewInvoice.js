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

const INVOICE_NUMBER = Math.floor(Math.random() * 90000) + 10000;
const date = new Date().toLocaleDateString();

// Date 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import DateTimePicker from '@react-native-community/datetimepicker';

export default function NewInvoice({ route, navigation }) {
    const { user } = useContext(AuthContext);
    const { type, businessID, accountType } = route.params
    // console.log("Type: ", type, "& BusinessID: ", businessID, "& AccountType", accountType)
    // console.log("INVOICE_NUMBER", INVOICE_NUMBER)

    const [loading, setLoading] = useState(false)
    const [customerName, setCustomerName] = useState('')
    const [commission, setCommission] = useState('')
    const [propertyDetail, setPropertyDetail] = useState('')
    const [amount, setAmount] = useState(0)
    const [paidAmount, setPaidAmount] = useState(0)

    // Date
    let today = new Date().toLocaleDateString()
    const [todaydate, setTodayDate] = useState(new Date(today));
    let selectdate = new Date(today)
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    // Customer OR Supplier Name Getting to add in Invoice 
    const [filteredData, setFilteredData] = useState([])
    const [search, setSearch] = useState('')
    const [customerSearch, setCustomerSearch] = useState('')
    const [noFoundDeal, setNoFoundDeal] = useState('')
    const [invoiceUserRecord, setInvoiceUserRecord] = useState([])
    const [accessType, setAccessType] = useState()

    const [filteredSupplierData, setFilteredSupplierData] = useState([])
    const [supplierSearch, setSupplierSearch] = useState('')
    const [invoiceSupplierRecord, setInvoiceSupplierRecord] = useState([])


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

    const ShowInvoiceUser = async (access, business) => {
        setInvoiceUserRecord([])
        setFilteredData([])

        setInvoiceSupplierRecord([])
        setFilteredSupplierData([])
        let tempCustomer = []
        let tempSupplier = []

        // console.log("id", id)
        setLoading(true)
        const response = await UserInvoiceRequest.getInvoiceUser(user.uid, access, business)
        // console.log("respone", response)
        if (response && response.length > 0) {
            console.log('Responses', response)
            for (let i = 0; i < response.length; i++) {
                if (response[i].status === "Customer") {
                    tempCustomer.push(response[i])
                    // setLoading(false)
                    // return true
                }
                if (response[i].status === "Supplier") {
                    tempSupplier.push(response[i])
                    // setLoading(false)
                    // return true
                }
            }
            setInvoiceUserRecord(tempCustomer)
            setFilteredData(tempCustomer)

            setInvoiceSupplierRecord(tempSupplier)
            setFilteredSupplierData(tempSupplier)
            setLoading(false)
        }
        else {
            setLoading(false)
        }
        setLoading(false)
    }

    const searchLeadDealFilter = (text) => {
        setSearch("")
        if (text) {
            const newData = invoiceUserRecord.filter((item) => {
                const itemData = item.invoicerName ? item.invoicerName.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setCustomerSearch(text)
        } else {
            //   setSearchData(true)
            setFilteredData(invoiceUserRecord)
            setCustomerSearch(text)
        }
    }

    const searchSupplierFilter = (text) => {
        setSearch("")
        if (text) {
            const newData = invoiceSupplierRecord.filter((item) => {
                const itemData = item.invoicerName ? item.invoicerName.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredSupplierData(newData)
            setSupplierSearch(text)

        } else {
            setFilteredSupplierData(invoiceSupplierRecord)
            setSupplierSearch(text)
        }
    }
    console.log("Customers : ", invoiceUserRecord)
    console.log("Suppliers : ", invoiceSupplierRecord)

    const changeCustomerName = (name) => {
        setSearch(name)
        setCustomerSearch(name)
        setFilteredData([])
    }

    const changeSupplierName = (name) => {
        setSearch(name)
        setSupplierSearch(name)
        setFilteredSupplierData([])
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



    const createInvoice = async () => {
        console.log("Business ID: ", user.uid)
        setLoading(true)
        if (search !== "" && commission !== "" && amount !== 0) {
            try {
                await firestore()
                    .collection('Invoice')
                    .add({
                        user_id: user.uid,
                        invoiceNo: INVOICE_NUMBER,
                        date: todaydate.toLocaleDateString(),
                        customerName: search,
                        commission: commission,
                        propertyDetail: propertyDetail,
                        totalAmount: amount,
                        dueAmount: amount,
                        paidAmount: paidAmount,

                        businessID: type == "own" ? businessID : user.uid,
                        role: type,
                        name: user.displayName,
                        accountType: accountType,

                        timestamp: firestore.Timestamp.fromDate(new Date()),
                    })
                    .then(() => {
                        // Alert.alert(
                        //     "Deal Done",
                        //     //"Image and Data has been uploaded successfully!"
                        // )
                        setLoading(false)
                        setCustomerName("")
                        setCommission("")
                        setPropertyDetail("")
                        setAmount('')

                        if (accountType == "Customer"){
                            navigation.navigate('Invoices')
                        }
                        else{
                            navigation.navigate('SupplierInvoices')
                        }
                        
                        // dealInventory()
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
        } else {
            Alert.alert(
                "Notice",
                "Please fill all fields first ..."
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
                    <Text style={HeaderStyle.HeaderText}>Create Invoice</Text>
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

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    {
                        accountType == "Supplier" ?
                            <Text style={[styles.textTitle, { marginTop: 20 }]}>
                                Supplier Name
                                <Text style={{ color: 'red' }}> *</Text>
                            </Text>
                            :
                            <Text style={[styles.textTitle, { marginTop: 20 }]}>
                                Customer Name
                                <Text style={{ color: 'red' }}> *</Text>
                            </Text>
                    }
                </View>

                {
                    accountType == "Customer" ?
                        <>
                            <TextInput
                                keyboardType='default'
                                style={styles.inputStyle}
                                placeholder=' Enter Name'
                                placeholderTextColor={"#A1A1A1"}
                                value={customerSearch}
                                onChangeText={(value) => searchLeadDealFilter(value)}
                            />

                            {
                                filteredData.length === 0 && search === "" ?
                                    <View style={{ width: "94%", alignSelf: "center", marginTop: 5, color: "red", flexDirection: 'row', justifyContent: 'space-between' }} >
                                        <Text style={styles.searchRecord}>{search} Customer not exist....</Text>

                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('NewUserInvoice',
                                                {
                                                    "type": accessType ? accessType.user_role : "business",
                                                    "businessID": accessType ? accessType.businessID : user.uid,
                                                    "status": "Customer",
                                                    "invoicersName": customerSearch !== "" ? customerSearch : "",
                                                }
                                            )}
                                            style={styles.buttonAdd}>
                                            <Text style={styles.btnTextAdd}> + Add </Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    customerSearch !== "" ?
                                        <View style={{ marginTop: 3 }}>
                                            <FlatList
                                                data={filteredData}
                                                keyExtractor={(stock) => stock.id}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <TouchableOpacity
                                                            style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginBottom: 5 }}
                                                            onPress={() => changeCustomerName(item.invoicerName)}
                                                        >
                                                            <Text style={{ color: 'black', fontSize: 15, marginBottom: 10, marginLeft: 10 }}>{item.invoicerName}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }}
                                            />
                                        </View>
                                        : null
                            }
                        </>
                        :
                        accountType == "Supplier" ?
                        <>
                            <TextInput
                                keyboardType='default'
                                style={styles.inputStyle}
                                placeholder=' Enter Name'
                                placeholderTextColor={"#A1A1A1"}
                                value={supplierSearch}
                                onChangeText={(value) => searchSupplierFilter(value)}
                            />

                            {
                                 filteredSupplierData.length === 0 && search === "" ?
                                //  filteredSupplierData.length === 0 && search > 0 ?
                                    <View style={{ width: "94%", alignSelf: "center", marginTop: 5, color: "red", flexDirection: 'row', justifyContent: 'space-between' }} >
                                        <Text style={styles.searchRecord}>{search} Supplier not exist....</Text>

                                        <TouchableOpacity
                                            onPress={() => navigation.navigate('NewUserInvoice',
                                                {
                                                    "type": accessType ? accessType.user_role : "business",
                                                    "businessID": accessType ? accessType.businessID : user.uid,
                                                    "status": "Supplier",
                                                    "invoicersName": supplierSearch
                                                }
                                            )}
                                            style={styles.buttonAdd}>
                                            <Text style={styles.btnTextAdd}> + Add </Text>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    supplierSearch !== "" ?
                                        <View style={{ marginTop: 3 }}>
                                            <FlatList
                                                data={filteredSupplierData}
                                                keyExtractor={(stock) => stock.id}
                                                renderItem={({ item }) => {
                                                    return (
                                                        <TouchableOpacity
                                                            style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, marginBottom: 5 }}
                                                            onPress={() => changeSupplierName(item.invoicerName)}
                                                        >
                                                            <Text style={{ color: 'black', fontSize: 15, marginBottom: 10, marginLeft: 10 }}>{item.invoicerName}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                }}
                                            />
                                        </View>
                                        : null
                            }

                        </>

                        :
                        null

                }

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textTitle, { marginTop: 20 }]}>
                        Description
                        <Text style={{ color: 'red' }}> *</Text>
                    </Text>
                </View>
                <TextInput
                    keyboardType='default'
                    style={styles.inputStyle}
                    placeholder=' Enter Description'
                    placeholderTextColor={"#A1A1A1"}
                    value={commission}
                    onChangeText={(value) => setCommission(value)}
                />


                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textTitle, { marginTop: 20 }]}>
                        Property Detail
                        {/* <Text style={{ color: 'red' }}> *</Text> */}
                    </Text>
                </View>
                <TextInput
                    keyboardType='default'
                    style={styles.inputStyle}
                    placeholder='Enter Property Detail'
                    placeholderTextColor={"#A1A1A1"}
                    value={propertyDetail}
                    onChangeText={(value) => setPropertyDetail(value)}
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textTitle, { marginTop: 20 }]}>
                        Amount
                        <Text style={{ color: 'red' }}> *</Text>
                    </Text>
                </View>

                <TextInput
                    keyboardType='numeric'
                    style={styles.inputStyle}
                    placeholder=' Enter Amount'
                    placeholderTextColor={"#A1A1A1"}
                    value={amount}
                    onChangeText={(values) => setAmount(values)}
                />

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
})