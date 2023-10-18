import React, { useState, useEffect, useContext, isValidElement } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    FlatList,
    Alert,
    ActivityIndicator,
    ImageBackground,
    ScrollView,
    Dimensions,
    BackHandler
} from 'react-native';

import Icon from 'react-native-vector-icons/AntDesign';
import Spinner from 'react-native-loading-spinner-overlay';
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'
import { dealApi } from '../../services';

export default function DealInfo({ route, navigation }) {
    const items = route.params
    // console.log("inventoryId is: ", items.item.id)
    // console.log("leadId is ", items.items.id)
    // console.log("inventoryId is: ", items.item)
    const leads = items.items
    const inventories = items.item
    // console.log(leads.leadName,">>>>",inventories.sellerName)

    const { role, businessID } = leads
    // console.log("leadId type ", role)

    // Lead Properties
    const leadId = items.items.id
    const leadName = items.items.leadName
    const leadMobile = items.items.mobile

    // Inventory Properties 
    const inventoryId = items.item.id
    const inventoryOwnerName = items.item.name
    const inventoryFrom = items.item.from
    const sellerName = inventories.sellerName
    const sellerMobile=inventories.sellerMobile

    // console.log(inventoryId)
    

    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("")
    const [dealAmount, setDealAmount] = useState("")
    const [buyerCommission, setBuyerCommission] = useState(0)
    const [sellerCommission, setSellerCommission] = useState(0)
    const [titleError, setTitleError] = useState("")
    const [dealAmountError, setDealAmountError] = useState("")
    const [buyerCommissionError, setBuyerCommissionError] = useState("")
    const [sellerCommissionError, setSellerCommissionError] = useState("")


    const [countryID, setCountryID] = useState('')

    const buyerAmountinPerc = (buyerCommissionAmount / dealAmount) * 100;
    const sellerAmountinPerc = (sellerCommissionAmount / dealAmount) * 100;

    const [buyerCommissionAmount, setBuyerCommisionAmount] = useState(0)
    const [sellerCommissionAmount, setSellerCommisionAmount] = useState(0)

    const [editAble, setEditAble] = useState(false)
    const [buyerSideEditable, setBuyerSideEditable] = useState(false)

    const [actualPrice, setActualPrice] = useState(" Price must contain numbers only")

    // synchronization data into Odoo 
    const [synchData, setSynchData] = useState("")
    const [description, setDescription] = useState("")
    // get integration Credentials  from Firebase DB
    useEffect(() => {
        getIntegrationData()
    }, [])
    // get integration Credentials  from Firebase DB
    const getIntegrationData = async () => {
        setLoading(true)
        let tempRecord = []
        await firestore().collection('odooIntegration')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const { user_id, URL, database, loginId, password } = doc.data()

                    if (user_id === user.uid) {
                        tempRecord.push({
                            database: database,
                            URL: URL,
                            loginId: loginId,
                            // password: password
                        });

                    }


                });
            })

        setSynchData(tempRecord)
        setLoading(false)
    }
    // console.log(">>>>>>>>>>>>>>>>>>>>", synchData[0].URL)
    // console.log("synchData.length", synchData.length)


    const ChangePrice = (e) => {
        var regex = /^[0-9]+$/;
        setDealAmount(e)
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


    // console.log("buyerCommissionAmount", typeof buyerCommissionAmount)

    const validateTitle = (text) => {
        setTitle(text)
        setTitleError("")
    }
    const validateDealAmount = (text) => {
        setDealAmount(text)
        setDealAmountError("")
    }
    const validateByerCommison = (text) => {
        let bComm = (dealAmount * text) / 100
        setBuyerCommisionAmount(bComm)
        setBuyerCommission(text)
        setBuyerCommissionError("")
    }
    const validateSellerCommison = (text) => {
        let sComm = (dealAmount * text) / 100
        setSellerCommisionAmount(sComm)
        setSellerCommission(text)
        setSellerCommissionError("")
    }

    const changeBuyerCommissionAmount = (text) => {
        // let bComm = (dealAmount*text)/100 
        let bPerc = (text / dealAmount) * 100
        setBuyerCommission(bPerc)
        setBuyerCommisionAmount(text)
    }

    const changeSellerCommissionAmount = (text) => {
        let sPerc = (text / dealAmount) * 100
        setSellerCommission(sPerc)
        setSellerCommisionAmount(text)
    }

    useEffect(() => {
        getCurrency()
    }, [])

    const getCurrency = async () => {
        var country = await AsyncStorage.getItem("@country");
        setCountryID(country)
    }

    // Function that Create Deal Collection
    const createDealHandler = async () => {

        setLoading(true)
        if (parseInt(sellerCommissionAmount) > parseInt(dealAmount)) {
            // console.log(">>>>>>>>>>>>>>>>>>>>> jjjjjjjjjjjjjjjjj", sellerCommissionAmount)

            // setNameError("Name Should Contain Only Alphabets")
            Alert.alert("Amount should be less than deal")
            setLoading(false)
            return true
        }
        if (parseInt(buyerCommissionAmount) > parseInt(dealAmount)) {
            // setNameError("Name Should Contain Only Alphabets")
            // console.log(">>>>>>>>>>>>>>>>>>>>>", buyerCommissionAmount > dealAmount)
            Alert.alert("Amount should be less than deal")
            setLoading(false)
            return true
        }
        if (parseInt(sellerCommissionAmount) + parseInt(buyerCommissionAmount) > parseInt(dealAmount)) {
            // setNameError("Name Should Contain Only Alphabets")
            // console.log(sellerCommissionAmount + buyerCommissionAmount)
            Alert.alert("Amount should be less than deal")
            setLoading(false)
            return true
        }
        if (title !== "" && dealAmount !== "" && description !== "") {
            if (buyerCommissionAmount !== "" || sellerCommissionAmount !== "") {
                if (synchData.length > 0) {
                    try {
                        let response = await dealApi(leadName.trim(), leadMobile.trim(),sellerName.trim(),sellerMobile.trim(), description, buyerCommissionAmount,sellerCommissionAmount, synchData[0].URL.trim())
                        console.log("res", response);
                        if (response.result != undefined) {
                            try {
                                await firestore()
                                    .collection('Deal')
                                    .add({
                                        user_id: user.uid,
                                        title: title,
                                        dealAmount: dealAmount,
                                        buyerCommission: buyerCommission,
                                        sellerCommission: sellerCommission,
                                        leads: leads,
                                        inventory: inventories,
                                        sellerName: sellerName,
                                        buyerName: leadName,
                                        buyerAmountinRs: buyerCommissionAmount,
                                        sellerAmountinRs: sellerCommissionAmount,
                                        name: user.displayName,
                                        role: role,
                                        isSyncked: true,
                                        businessID: businessID,
                                        timestamp: firestore.Timestamp.fromDate(new Date()),
                                    })
                                    .then(() => {
                                        // Alert.alert(
                                        //     "Deal Done",
                                        //     //"Image and Data has been uploaded successfully!"
                                        // )
                                        setLoading(false)
                                        setTitle("")
                                        setDealAmount("")
                                        setBuyerCommission("")
                                        setSellerCommission("")
                                        dealInventory()
                                        // navigation.pop(2)
                                    })

                            } catch (err) {
                                console.log(err)
                                setLoading(false)
                            }

                        }
                        else {
                            alert("somethings wrong! Try agian")
                        }

                        setLoading(false)

                    } catch (error) {
                        console.log("errors", error)
                        setLoading(false)
                    }

                }
                else {
                    try {
                        await firestore()
                            .collection('Deal')
                            .add({
                                user_id: user.uid,
                                title: title,
                                dealAmount: dealAmount,
                                buyerCommission: buyerCommission,
                                sellerCommission: sellerCommission,
                                leads: leads,
                                inventory: inventories,
                                sellerName: sellerName,
                                buyerName: leadName,
                                buyerAmountinRs: buyerCommissionAmount,
                                sellerAmountinRs: sellerCommissionAmount,
                                name: user.displayName,
                                role: role,
                                isSyncked: false,
                                businessID: businessID,
                                timestamp: firestore.Timestamp.fromDate(new Date()),
                            })
                            .then(() => {
                                // Alert.alert(
                                //     "Deal Done",
                                //     //"Image and Data has been uploaded successfully!"
                                // )
                                setLoading(false)
                                setTitle("")
                                setDealAmount("")
                                setBuyerCommission("")
                                setSellerCommission("")
                                dealInventory()
                                // navigation.pop(2)
                            })

                    } catch (err) {
                        console.log(err)
                        setLoading(false)
                    }
                }

            } else {
                Alert.alert(
                    "Notice",
                    "Please fill Commission first ..."
                )
                setLoading(false)
            }
        } else {
            Alert.alert(
                "Notice",
                "Please fill all fields first ..."
            )
            setLoading(false)
        }
    }

    const dealInventory = async () => {
        setLoading(true)
        try {
            firestore()
                .collection(inventoryFrom)
                .doc(inventoryId)
                .update({
                    deal: inventoryFrom == "Marketplace" ? false : true
                })
                .then(() => {
                    console.log("Inventory Status Updated")
                    // setStatusModalOpen(false)
                    // modalCloseHandler()
                    // loadInventoryList()
                    setLoading(false)
                    dealLead()
                    // Alert.alert("Status Updated")
                    // navigation.navigate("Leads")
                })

        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    const dealLead = async () => {
        setLoading(true)
        try {
            firestore()
                .collection('leads')
                .doc(leadId)
                .update({
                    deal: true
                })
                .then(() => {
                    console.log("Lead Status Updated")
                    // setStatusModalOpen(false)
                    // modalCloseHandler()
                    // loadInventoryList()
                    setLoading(false)
                    navigation.pop(3)
                    // Alert.alert("Status Updated")
                    // navigation.navigate("Leads")
                })

        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }


    const ChangePercentageToPkr = (val) => {
        if (val == "per") {
            setEditAble(true)
            setSellerCommission(0)
            setSellerCommisionAmount(0)
        }
        else {
            setEditAble(false)
            setSellerCommission(0)
            setSellerCommisionAmount(0)
        }
    }
    const ConvertPercentageSeller = (val) => {
        let percentageToPKR = (val * dealAmount) / 100
        if (percentageToPKR <= dealAmount) {
            setSellerCommission(val)
            setSellerCommisionAmount(percentageToPKR)
        }
        else {
            alert("Please Enter Valid Percentage!")
        }


    }

    const ChangePercentageToPkrBuyer = (val) => {
        if (val == "per") {
            setBuyerSideEditable(true)
            setBuyerCommission(0)
            setBuyerCommisionAmount(0)
        }
        else {
            setBuyerSideEditable(false)
            setBuyerCommission(0)
            setBuyerCommisionAmount(0)
        }
    }
    const ConvertPercentageBuyer = (val) => {
        let percentageToPKR = (val * dealAmount) / 100
        if (percentageToPKR <= dealAmount) {
            setBuyerCommission(val)
            setBuyerCommisionAmount(percentageToPKR)
        }
        else {
            alert("Please Enter Valid Percentage!")
        }
    }
    return (
        <ScrollView keyboardShouldPersistTaps={"always"} contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }

            {/* Deal Info Header  */}
            <View style={HeaderStyle.mainContainer}>
                <View style={HeaderStyle.arrowbox}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="left" color="#1A1E25" size={20} />
                    </TouchableOpacity>
                </View>
                <View style={HeaderStyle.HeaderTextContainer}>
                    <Text style={HeaderStyle.HeaderText}>Deal Info</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain'
                        //source={require('../../assets/images/personpic.png')} 
                        source={{ uri: user.photoURL }}
                    />
                </View>
            </View>

            {/* Text Input for Deal Title */}
            <View style={{ width: "92%", alignSelf: 'center', marginTop: 15 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textHeading, { marginTop: 10 }]}>
                        Deal Title
                        <Text style={{ color: 'red' }}> *</Text>
                    </Text>
                </View>
                <TextInput
                    keyboardType="default"
                    style={styles.inputStyle}
                    placeholder='Enter deal title'
                    placeholderTextColor={"#A1A1A1"}
                    value={title}
                    onChangeText={(value) => validateTitle(value)}
                />

                {/* Text Input for Deal Amount */}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={[styles.textHeading, { marginTop: 10 }]}>
                        Deal amount
                        <Text style={{ color: 'red' }}> *</Text>
                    </Text>
                </View>
                <TextInput
                    keyboardType='numeric'
                    style={styles.inputStyle}
                    placeholder='Enter deal amount e.g: 25000'
                    placeholderTextColor={"#A1A1A1"}
                    value={dealAmount}
                    onChangeText={(value) => ChangePrice(value)}
                />

                {
                    actualPrice == "Amount must contain numbers only" ?
                        <Text style={{ marginLeft: 5, marginTop: 5 }}>Price must contain numbers only</Text>
                        :
                        <Text style={{ marginLeft: 5, marginTop: 5 }}>{dealAmount.length == 4 ? dealAmount.charAt(0) : dealAmount.length == 5 ? dealAmount.slice(0, 2) : dealAmount.length == 6 ? dealAmount.charAt(0) + "  Lakh and " + dealAmount.slice(1, 3) : dealAmount.length == 7 ? dealAmount.slice(0, 2) + "  Lakh and " + dealAmount.slice(2, 4) : dealAmount.length == 8 ? dealAmount.charAt(0) + "  Crore  " + dealAmount.slice(1, 3) + "  Lakh and  " + dealAmount.slice(3, 5) : dealAmount.length == 9 ? dealAmount.slice(0, 2) + "  Crore  " + dealAmount.slice(2, 4) + "  Lakh and  " + dealAmount.slice(4, 6) : dealAmount.length == 10 ? dealAmount.charAt(0) + "  Arab  " + dealAmount.slice(1, 3) + "  Crore  " + dealAmount.slice(3, 5) + "  Lakh and  " + dealAmount.slice(5, 7) : dealAmount.length == 11 ? dealAmount.slice(0, 2) + "  Arab  " + dealAmount.slice(2, 4) + "  Crore  " + dealAmount.slice(4, 6) + "  Lakh and  " + dealAmount.slice(6, 8) : null} {actualPrice}</Text>
                }

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: '#1A1E25' }}>Seller Name</Text>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#7D7F88', marginTop: 5, }}>{sellerName}</Text>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />

                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 14, fontWeight: '900', color: '#1A1E25' }}>Buyer Name</Text>
                    <Text style={{ fontSize: 14, fontWeight: '400', color: '#7D7F88', marginTop: 5, }}>{leadName}</Text>
                </View>
                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />
                <Text style={{
                    marginTop: 15, color: "#1A1E25",
                    fontSize: 14,
                    fontWeight: "900",
                }}>Description <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput
                    style={{
                        width: "100%",
                        textAlign: "left",
                        borderBottomWidth: 1,
                        borderColor: "#E2E2E2",
                        color: "#000000",
                        paddingLeft: 0,
                        paddingBottom: 0,
                        fontSize: 12,
                        fontWeight: "500",
                        marginTop: -5,
                    }}
                    placeholder='Enter description here'
                    placeholderTextColor={"#A1A1A1"}
                    value={description}
                    onChangeText={(value) => setDescription(value)}
                />

                {/* <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} /> */}
                <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#000000', textAlign: 'center', marginTop: 20 }}>
                    Commission
                </Text>
                {/* Text Input Buyer and Seller  */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>
                    <View style={{ flex: 1, }}>
                        <Text style={[styles.textHeading, { marginTop: 25, }]}>
                            Buyer
                            {/* <Text style={{color:'red'}}> *</Text> */}
                        </Text>
                        <TouchableOpacity onPress={() => ChangePercentageToPkrBuyer()} style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Text style={styles.textHeading}>
                                {countryID == "UAE" ? "AED " : countryID == "India" ? "INR " : countryID == "Bangladesh" ? "BDT " : "PKR "}
                                {/* {buyerAmountinRs} */}
                            </Text>
                            {
                                buyerSideEditable == false ?
                                    <TextInput
                                        value={buyerCommissionAmount}
                                        onChangeText={(text) => changeBuyerCommissionAmount(text)}
                                        keyboardType="numeric"
                                        style={styles.inputStyleBuyer}
                                        placeholderTextColor={"#A1A1A1"}
                                    />
                                    :
                                    <Text>{buyerCommissionAmount}</Text>
                            }

                            {/* <TextInput
                                keyboardType="numeric"
                                placeholder="Commission"
                                maxLength={2}
                                placeholderTextColor={"#A1A1A1"}
                                value={buyerCommission}
                                onChangeText={(text) => validateByerCommison(text)}
                                style={styles.inputStyleBuyer}
                            /> */}
                            {/* <Text style={{ fontSize: 20, marginTop: 15, color: '#000000' }}>%</Text> */}
                        </TouchableOpacity>
                        <Text style={[styles.textCommission, { marginTop: 15 }]}>Buyer Commission</Text>
                        <TouchableOpacity onPress={() => ChangePercentageToPkrBuyer("per")} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                            {/* <Text style={styles.textHeading}>
                                {countryID == "UAE" ? "AED " : countryID == "India" ? "INR " : countryID == "Bangladesh" ? "BDT " : "PKR "}
                                {/* {buyerAmountinRs} */}
                            {/* </Text>
                            <TextInput
                                value={buyerCommissionAmount.toString()}
                                onChangeText={(text) => changeBuyerCommissionAmount(text)}
                                keyboardType="numeric"
                                style={styles.textHeading}
                            /> */}
                            {
                                buyerSideEditable == true ?
                                    <TextInput
                                        placeholder='0.00'
                                        keyboardType='numeric'
                                        value={buyerCommission}
                                        onChangeText={(val) => ConvertPercentageBuyer(val)}

                                    // onBlur={() => setEditAble(false)}
                                    />

                                    :
                                    <Text style={styles.textHeading}>
                                        {parseFloat(buyerCommission).toFixed(2)}
                                    </Text>

                            }



                            <Text style={{ fontSize: 14, color: '#000000', marginLeft: buyerSideEditable ? -3 : 5 }}>%</Text>

                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={[styles.textHeading, { marginTop: 25, textAlign: 'center' }]}>
                            Seller
                            {/* <Text style={{color:'red'}}> *</Text> */}
                        </Text>
                        <TouchableOpacity onPress={() => ChangePercentageToPkr()} style={{ height: 40, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Text style={styles.textHeading}>
                                {countryID == "UAE" ? "AED " : countryID == "India" ? "INR " : countryID == "Bangladesh" ? "BDT " : "PKR "}
                                {/* {sellerAmountinRs} */}
                            </Text>
                            {
                                editAble == false ?
                                    <TextInput
                                        value={sellerCommissionAmount}
                                        onChangeText={(text) => changeSellerCommissionAmount(text)}
                                        keyboardType="numeric"
                                        style={styles.inputStyleSeller}
                                        placeholderTextColor={"#A1A1A1"}
                                    />
                                    :
                                    <Text>{sellerCommissionAmount}</Text>

                            }

                            {/* <TextInput
                                keyboardType="numeric"
                                placeholder="Commission"
                                maxLength={2}
                                placeholderTextColor={"#A1A1A1"}
                                // mask="0399-9999999"
                                value={sellerCommission}
                                onChangeText={(text) => validateSellerCommison(text)}
                                style={styles.inputStyleSeller}
                            />
                            <Text style={{ fontSize: 20, marginTop: 15, color: '#000000' }}>%</Text> */}
                        </TouchableOpacity>
                        <Text style={[styles.textCommission, { marginTop: 15, }]}>Seller Commission</Text>
                        <TouchableOpacity onPress={() => ChangePercentageToPkr("per")} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}>
                            {/* <Text style={styles.textHeading}>
                                {countryID == "UAE" ? "AED " : countryID == "India" ? "INR " : countryID == "Bangladesh" ? "BDT " : "PKR "}
                                {/* {sellerAmountinRs} */}
                            {/* </Text>
                            <TextInput
                                value={sellerCommissionAmount.toString()}
                                onChangeText={(text) => changeSellerCommissionAmount(text)}
                                keyboardType="numeric"
                                style={styles.textHeading}
                            /> */}
                            {
                                editAble == true ?
                                    <TextInput
                                        placeholder='0.00'
                                        keyboardType='numeric'
                                        value={sellerCommission}
                                        onChangeText={(val) => ConvertPercentageSeller(val)}

                                    // onBlur={() => setEditAble(false)}
                                    />
                                    :
                                    <Text style={styles.textHeading}>
                                        {parseFloat(sellerCommission).toFixed(2)}
                                    </Text>
                            }



                            <Text style={{ fontSize: 14, color: '#000000', marginLeft: editAble ? -3 : 5 }}>%</Text>

                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Sold Button  */}
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <TouchableOpacity
                    style={styles.button}
                    // activeOpacity
                    // disabled={true}
                    onPress={createDealHandler}>
                    <Text style={styles.btnText}>Sold</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    textHeading: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "900",
        alignSelf: 'center'
    },
    textCommission: {
        color: "#000000",
        fontSize: 14,
        fontWeight: "500",
        alignSelf: 'center'
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
    inputStyleBuyer: {
        width: "45%",
        textAlign: 'left',
        borderBottomWidth: 1,
        borderColor: "#E2E2E2",
        color: "#000000",
        paddingLeft: 0,
        paddingBottom: 0,
        fontSize: 14,
        fontWeight: "600"
    },
    inputStyleSeller: {
        width: "45%",
        //flex:1,
        textAlign: "left",
        borderBottomWidth: 1,
        borderColor: "#E2E2E2",
        color: "#000000",
        paddingLeft: 0,
        paddingBottom: 0,
        fontSize: 14,
        fontWeight: "600"
    },
    errorStyle: {
        color: 'red',
        fontSize: 10
    },
    button: {
        backgroundColor: "#917AFD",
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 10,
        // marginTop: 50,
    },
    btnText: {
        textAlign: 'center',
        color: 'white',
        margin: 15,
    }
})