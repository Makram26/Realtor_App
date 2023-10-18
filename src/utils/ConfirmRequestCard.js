import React, { useEffect, useState } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    FlatList,
    RefreshControl,
    Alert
} from 'react-native';

import { confirmRequestStyles } from '../constants/Styles';
import CheckBox from '@react-native-community/checkbox'
import firestore from '@react-native-firebase/firestore'

import Icon from 'react-native-vector-icons/Ionicons'
import notificationsAPI from '../api/Notifications';

export default function ConfirmRequestCard({
    seller,
    invoiceNo,
    products,
    totalAmount,
    fetchRequest,
    requestID,
    navigation,
    image,
    identity,
    seller_ID,
    token,
    buyer_Image,
    buyer_name,
    adminId,
    userRole,
}) {

    const PRODUCTS = products
    // console.log("requestID", requestID)
    // console.log("PRODUCTS", products)

    const [productList, setProductList] = useState([])
    const [select, setSelected] = useState([])
    const [total, setTotal] = useState(0)
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        setCurrentDate(
            date + '-' + month + '-' + year
        );
    }, []);

    // console.log("currentDate", currentDate)

    useEffect(() => {
        InsetItemsHandler()
    }, [PRODUCTS])

    const InsetItemsHandler = () => {
        var list = []

        PRODUCTS.map((item) => {
            list.push({
                checked: false,
                product_id: item.product_id,
                product_name: item.product_name,
                quantity_requested: item.quantity_requested,
                sellingPrice: item.sellingPrice,
                productImage: item.productImage ? item.productImage : ''
            })
        })

        // console.log("cardList", list)
        setProductList(list)
    }

    // console.log("productList",productList)

    const onChangeValue = (value, index) => {

        const newData = [...productList];
        newData[index].checked = value
        let filterArray = newData.filter(item => {
            return item.checked == true
        })
        var totalArray = []
        filterArray.map((item, indexs) => {
            // item.products.map((items,index) => {
            totalArray.push(parseInt(item.sellingPrice * item.quantity_requested));
            // })
        })
        var total = 0;
        for (var i in totalArray) {
            total += totalArray[i];
        }

        // console.log("filterArray", filterArray)
        // console.log("total", total)
        setTotal(total)
        setSelected(filterArray)
        setProductList(newData);
    }

    // console.log("checked",select)

    const approveRequestHandler = (requestID) => {
        const result = invoiceNo.substring(0, 2);
        // console.log("result", result)
        // if (select.length > 0) {
        if (result == "PR") {
            try {
                firestore()
                    .collection("ProductRequest")
                    .doc(requestID)
                    .update({
                        status: "Approved by Buyer",
                        products: select,
                        approvedByBuyerAt: currentDate,
                        totalAmount: total
                        // reason: difference,
                        // postTime: firestore.Timestamp.fromDate(new Date())
                    })
                    .then(() => {
                        //     // register(email,password)
                        //     // navigation.navigate('Home')
                        // Alert.alert("Attention!","Request Sent for Approval")
                        // navigation()
                        navigation()
                        loadSearchInventory(token, 'Requests Received', `${buyer_name} has confirmed Products`, currentDate)
                    });
            } catch (e) {
                // console.log(e)
                // setLoading(false)
            }
        }
        else if (result == "SB") {
            try {
                firestore()
                    .collection("SaleBill")
                    .doc(requestID)
                    .update({
                        status: "Approved by Buyer",
                        product: select,
                        approvedByBuyerAt: currentDate,
                        totalAmount: total,
                        documentFrom: 'SaleBill'
                        // reason: difference,
                        // postTime: firestore.Timestamp.fromDate(new Date())
                    })
                    .then(() => {
                        //     // register(email,password)
                        //     // navigation.navigate('Home')
                        // Alert.alert("Attention!","Request Sent for Approval")
                        // navigation()
                        navigation()
                        loadSearchInventory(token, 'Requests Received', `${buyer_name} has confirmed Products`, currentDate)
                        // loadSearchInventory(token, 'Requests Received', `${buyer_name} has confirmed Products`, currentDate)
                    });
            } catch (e) {
                // console.log(e)
                // setLoading(false)
            }
        }
    }

    const loadSearchInventory = async (token, title, message, date) => {
        const response = await notificationsAPI.sendNotification(token, title, message);
        // console.log("response", response)
        if (response && response.ok && response.data && response.data.msg) {
            // console.log("Notification sent sucessfully")
            pushToNotifications(date)
            // setLoading(false)
            
        } else {
            // console.log("Notification not sent sucessfully")
            // setLoading(false)
        }
    }

    const pushToNotifications = async (date) => {
        try {
            await firestore()
                .collection("Notifications")
                .add({
                    userID: seller_ID,
                    name: buyer_name,
                    Image: buyer_Image,
                    type: 'Confirm Requests',
                    receivedAt: date,
                    timestamp: firestore.Timestamp.fromDate(new Date())
                })
                .then(() => {

                    // console.log("sent to notifications")
                });
        } catch (e) {
            // console.log(e)
            // setLoading(false)
        }
    }

    return (
        <View style={confirmRequestStyles.card} key={identity}>
            <View style={confirmRequestStyles.cardHeading}>
                <View style={{ width: '20%', padding: 2, alignItems: 'center', justifyContent: 'center' }}>
                    {
                        image ?
                            <Image
                                source={{ uri: image }}
                                // style={{ width: '80%', height: 60, borderRadius: 50 }}
                                // resizeMode="cover"
                                style={{   // width:60.1,
                                    marginLeft: 5,
                                    width: 31.64,
                                    height: 32.41,
                                    // borderColor:'red',
                                    // borderWidth:1,
                                    borderRadius: 8,

                                }}
                                resizeMode='cover'
                            />
                            :
                            // <Icon
                            //     name='md-person-circle-sharp'
                            //     color='#282B4E'
                            //     size={50}
                            //     style={{ marginLeft: 2 }}
                            // />
                            <Image
                                source={require('../assets/images/prophoto.jpg')}
                                // style={{ width: '100%', height: 75, borderRadius: 8, backgroundColor: '#c3c3c3' }}
                                // resizeMode="cover"
                                style={{   // width:60.1,
                                    marginLeft: 5,
                                    width: 31.64,
                                    height: 32.41,

                                    // borderColor:'red',
                                    // borderWidth:1,
                                    borderRadius: 8,

                                }}
                                resizeMode='cover'
                            />
                    }

                </View>

                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', }}>
                    <View style={{ justifyContent: 'space-between', flex: 1 }}>
                        <Text style={{ color: '#30009C', fontSize: 12, fontWeight: '500', fontFamily: "Poppins-SemiBold", lineHeight: 18 }}>Supplier</Text>
                        <Text style={{ color: '#525252', fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Poppins" }}>{seller && seller ? seller.charAt(0).toUpperCase() + seller.slice(1).toLowerCase() : ""}</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginRight: 15, }}>
                        <Text style={{ color: '#30009C', fontSize: 12, fontWeight: '500', fontFamily: "Poppins-SemiBold", lineHeight: 18 }}>Invoice ID</Text>
                        <Text style={{ color: '#525252', fontSize: 12, fontWeight: "400", lineHeight: 18, fontFamily: "Poppins" }}>{invoiceNo}</Text>
                    </View>
                </View>
            </View>
            <View style={confirmRequestStyles.table}>
                <View style={confirmRequestStyles.tableHeader}>
                    <View style={confirmRequestStyles.tableCell}><Text style={confirmRequestStyles.tableText}>Product</Text></View>
                    <View style={confirmRequestStyles.tableCell}><Text style={confirmRequestStyles.tableText}>QTY</Text></View>
                    <View style={confirmRequestStyles.tableCell}><Text style={confirmRequestStyles.tableText}>Price</Text></View>
                    <View style={confirmRequestStyles.tableCell1}><Text style={confirmRequestStyles.tableText}>Check</Text></View>
                </View>
                <FlatList
                    data={productList}
                    keyExtractor={(stock) => stock.id}
                    renderItem={({ item, index }) => (
                        <View style={confirmRequestStyles.tableHeader} key={item.product_id}>
                            <View style={confirmRequestStyles.tableCell}><Text style={confirmRequestStyles.tableBodyText}>{item.product_name}</Text></View>
                            <View style={confirmRequestStyles.tableCell}><Text style={confirmRequestStyles.tableBodyText}>{item.quantity_requested}</Text></View>
                            <View style={confirmRequestStyles.tableCell}><Text style={confirmRequestStyles.tableBodyText}>Rs.{item.sellingPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text></View>
                            <View style={confirmRequestStyles.tableCell1}>
                                <CheckBox
                                    disabled={false}
                                    value={item.checked}
                                    // style={styles.checkBox}
                                    tintColors={{ true: '#38386A', false: '#38386A' }}
                                    onValueChange={(newValue) => onChangeValue(newValue, index)}
                                />
                            </View>
                        </View>
                    )}
                />
            </View>
            <View style={confirmRequestStyles.totalContainer}>
                <Text style={{ color: '#30009C', fontWeight: '500', fontSize: 12, lineHeight: 14, fontFamily: "Poppins-SemiBold", }}>GRAND TOTAL:  </Text>
                <Text style={{ color: '#525252', fontWeight: '500', fontSize: 12, lineHeight: 14, fontFamily: "Poppins-SemiBold", }}>Rs. {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
            </View>
            <View style={confirmRequestStyles.buttonContainer}>
                {
                    total > 0 ?
                        <View >
                            {
                                userRole === "request_writer" || adminId === "" ?
                                    <TouchableOpacity style={confirmRequestStyles.acceptButton} onPress={() => approveRequestHandler(requestID)}>
                                        <Text style={{ color: 'white', fontSize: 10, lineHeight: 15, fontFamily: "Poppins" }}>Approve</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={confirmRequestStyles.acceptButton} onPress={() => alert("Access Denied!")} >
                                        <Text style={{ color: 'white', fontSize: 10, lineHeight: 15, fontFamily: "Poppins" }}>Approve</Text>
                                    </TouchableOpacity>
                            }
                        </View>

                        :
                        <View >
                            {
                                userRole === "request_writer" || adminId === "" ?
                                    <TouchableOpacity style={confirmRequestStyles.acceptButtonDisabled} >
                                        <Text style={{ color: 'white', fontSize: 10, lineHeight: 15, fontFamily: "Poppins" }}>Approve</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={confirmRequestStyles.acceptButtonDisabled} onPress={() => alert("Access Denied!")} >
                                        <Text style={{ color: 'white', fontSize: 10, lineHeight: 15, fontFamily: "Poppins" }}>Approve</Text>
                                    </TouchableOpacity>
                            }
                        </View>


                }

            </View>
        </View>
    )
}

