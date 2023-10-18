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
import Icon1 from 'react-native-vector-icons/EvilIcons';
import Spinner from 'react-native-loading-spinner-overlay';

import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
import PaymentRecordCard from '../../components/PaymentRecordCard';

import InvoiceRequest from '../../api/InvoiceRequest';
import PermissionAPI from '../../api/PermissionsAPIs/checkUserAPI'

export default function PaymentsRecord({ route, navigation }) {

    const items = route.params
    const invoiceType = items.invoiceType
    console.log("Payments for", items)

    const { user } = useContext(AuthContext);

    const [filteredData, setFilteredData] = useState([])
    const [search, setSearch] = useState('')
    const [noFoundDeal, setNoFoundDeal] = useState('')
    const [customerPayment, setCustomerPayment] = useState([])
    const [supplierPayment, setSupplierPayment] = useState([])
    const [loading, setLoading] = useState(false)

    const [accessType, setAccessType] = useState()

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
            ShowInvoice(respone.user_role, respone.businessID)
        }
        else {
            ShowInvoice("business", user.uid)
        }
    }

    const ShowInvoice = async (access, business) => {
        setCustomerPayment([])
        setSupplierPayment([])
        setFilteredData([])
        let tempCustomer = []
        let tempSupplier = []

        // console.log("id", id)
        setLoading(true)
        const response = await InvoiceRequest.getInvoice(user.uid, access, business)
        // console.log("respone", response)
        if (response && response.length > 0) {
            for (let i = 0; i < response.length; i++) {
                if (response[i].accountType === "Customer") {
                    tempCustomer.push(response[i])
                }
                if (response[i].accountType === "Supplier") {
                    tempSupplier.push(response[i])
                }
            }
            setCustomerPayment(tempCustomer)
            setSupplierPayment(tempSupplier)

            setFilteredData(tempCustomer)
            setFilteredData(tempSupplier)
            setLoading(false)
        }
        // if (response && response.length > 0) {
        //     setInvoiceRecord(response)
        //     setFilteredData(response)
        //     setLoading(false)
        // }
        else {
            setLoading(false)
        }
        setLoading(false)
    }

    const searchLeadDealFilter = (text) => {
        if (text) {
            const newData = customerPayment.filter((item) => {
                const itemData = item.customerName ? item.customerName.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setSearch(text)
        } else {
            //   setSearchData(true)
            setFilteredData(customerPayment)
            setSearch(text)
        }
    }

    const searchSupplierFilter = (text) => {
        if (text) {
            const newData = supplierPayment.filter((item) => {
                const itemData = item.customerName ? item.customerName.toUpperCase() : ''.toUpperCase();
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setSearch(text)
        } else {
            //   setSearchData(true)
            setFilteredData(supplierPayment)
            setSearch(text)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#FCFCFC" }}>
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

                    {
                        invoiceType === "Customer" ?
                            <Text style={HeaderStyle.HeaderText}>Customer Payments</Text>
                            :
                            <Text style={HeaderStyle.HeaderText}>Supplier Payments</Text>

                    }
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: user.photoURL }} />
                </View>
            </View>

            {/* Search Container */}
            <View style={HeaderStyle.searchContainer}>
                <Icon1 name="search" color="#1A1E25" size={30} style={{ marginLeft: 10 }} />
                <TextInput style={HeaderStyle.searchText}
                    placeholder='Search payment record by Name....'
                    placeholderTextColor={"#7D7F88"}
                    value={search}
                    onChangeText={(text) => searchLeadDealFilter(text)}
                />
            </View>
            {
                filteredData.length === 0 && search.length > 0 ?
                    <View style={{ width: "92%", alignSelf: "center", marginTop: 5, marginLeft: 5 }} >
                        <Text style={styles.searchRecord}>{search} Not found!</Text>
                    </View>
                    :
                    null
            }

            {/* Payment Records */}

            {
                invoiceType === "Customer" ?
                    customerPayment.length < 1 ?
                        <View style={{ flex: 1 }}>
                            <Text style={styles.emptyUserRecord}>You do not have any Payment Record!</Text>
                        </View>
                        :
                        <FlatList
                            data={customerPayment}
                            keyExtractor={(stock) => stock.id}
                            renderItem={({ item }) => {
                                return (
                                    <PaymentRecordCard
                                        customerName={item.customerName}
                                        totalAmount={item.totalAmount}
                                        dueAmount={item.dueAmount}
                                        paidAmount={item.paidAmount}
                                        invoiceNo={item.invoiceNo}
                                        date={item.date}
                                        commission={item.commission}
                                        navigation = {()=> navigation.navigate("InvoiceDetail", item)}
                                    />
                                )
                            }}
                        />
                    :
                    supplierPayment.length < 1 ?
                        <View style={{ flex: 1 }}>
                            <Text style={styles.emptyUserRecord}>You do not have any Payment Record!</Text>
                        </View>
                        :
                        <FlatList
                            data={supplierPayment}
                            keyExtractor={(stock) => stock.id}
                            renderItem={({ item }) => {
                                return (
                                    <PaymentRecordCard
                                        customerName={item.customerName}
                                        totalAmount={item.totalAmount}
                                        dueAmount={item.dueAmount}
                                        paidAmount={item.paidAmount}
                                        invoiceNo={item.invoiceNo}
                                        date={item.date}
                                        commission={item.commission}
                                        navigation = {()=> navigation.navigate("InvoiceDetail", item)}
                                    />
                                )
                            }}
                        />
            }


        </View>
    )

}


const styles = StyleSheet.create({
    emptyUserRecord: {
        color: '#8A73FB',
        alignSelf: 'center',
        fontWeight: '800',
        textAlign: 'center',
        width: '96%',
        fontSize: 20,
        marginVertical: '50%'
    },
    searchRecord: {
        color: 'red',
        fontWeight: '500',
        fontSize: 15,
    },
    heading: {
        marginRight: 5,
        width: "19%",
        alignSelf: 'center',
        textAlign: 'center',
        color: '#8A73FB'
    },
    paymentText: {
        marginRight: 5,
        width: "19%",
        alignSelf: 'center',
        textAlign: 'center',
        color: "#000"
    },

})