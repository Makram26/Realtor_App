import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Dimensions, Linking, Modal, FlatList, Alert, RefreshControl } from 'react-native'

import Spinner from 'react-native-loading-spinner-overlay';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/FontAwesome'

import { HeaderStyle } from '../../constants/Styles';
import { AuthContext } from '../../auth/AuthProvider'

import LeadAPI from '../../api/LeadsRequest'
import UsersAPI from '../../api/UserSettingAPIs/UserSettingsAPI'
import firestore from '@react-native-firebase/firestore'

import TaskApi from '../../api/TasksRequest'

const InventoryCard = ({ propertyImg, houseName, address, rooms, area, areatype, rent, transactionType, propertyType, navigate }) => {
    return (
        <TouchableOpacity style={styles.card} onPress={navigate}>
            <View style={styles.imageContainer}>
                {
                    propertyImg ?
                        <Image
                            source={{ uri: propertyImg }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode='stretch'
                        />
                        :
                        <Image
                            //source={require('../assets/images/image2.jpg')}
                            source={require('../../assets/images/nommage.jpg')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode='contain'
                        />
                }
            </View>
            {/* {
                console.log("<><><><</></>",address)
            } */}
            <View style={styles.detailsContainer}>
                <View style={{}}>
                    {
                        houseName ?
                        <Text numberOfLines={1} style={styles.houseName}>{houseName}</Text>
                        :
                        null
                    }    
                    <Text style={{ ...styles.houseAddress, marginTop: 5, marginBottom: 5 }}>{address}</Text>
                    {/* <View style={{backgroundColor:"green"}}>

                    <Text style={{...styles.houseAddress,backgroundColor:"red"}}>{address}</Text>
                    </View> */}
                    <Text style={{ ...styles.property, marginBottom: 5 }}>{propertyType}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '60%', alignItems: 'center' }}>
                    {
                        propertyType == 'Plot' || propertyType == 'Files' || propertyType == 'Shop' || propertyType == 'Agriculture' ?
                            null
                            :
                            <>

                                <Icon2
                                    name='bed'
                                    color='#7D7F88'
                                    size={14}
                                />
                                <Text style={styles.houseAddress}>{rooms} Rooms</Text>
                            </>
                    }

                    <View style={{ flexDirection: "row" }}>

                        <Icon2
                            name='home'
                            color='#7D7F88'
                            size={14}
                        />
                        <Text style={styles.houseAddress}>{area + " " + areatype}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={styles.houseRent}>Rs. {rent.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        {
                            transactionType == "Sale" ?
                                <Text style={styles.rentType}></Text>
                                :
                                <Text style={styles.rentType}>/ month</Text>
                        }
                    </Text>
                    <Text style={styles.typeText}>Inventory</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const LeadCard = ({
    name,
    mobile,
    assign
}) => {
    return (
        <TouchableOpacity style={styles.contactCard} onPress={assign}>
            <Text style={styles.leadName}>{name}</Text>
            <View style={styles.phoneContainer}>
                <Text style={styles.phone}>{mobile}</Text>
                <View style={styles.callButton}>
                    <Text style={styles.leadName}>Reassign</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const MESSAGE = 'How we can help you?'

export default function LeadDetail({ route, navigation }) {
    const items = route.params
    // console.log("LeadDetail", items);
    const {
        leadName,
        mobile,
        catagory,
        societyName,
        bedroomsQuantity,
        size,
        size_type,
        portion_type,
        property_type,
        unitType,
        description,
        budget,
        id,
        role,
        businessID,
        inventoryProperty,
        name,
        hasInventory,
        inventoryID,
        hasTask,
        taskID,
        status,
        sourceType,
        facilities
    } = items

    console.log(property_type)

    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    const [inventory, setInventory] = useState([])
    const [users, setUsers] = useState([])

    const [showLeadsModal, setLeadsModal] = useState(false)

    // Task State on Call Button
    const [leads, setLeads] = useState(null)
    const [inventories, setInventories] = useState(null)
    let today = new Date().toLocaleDateString()
    let todayTime = new Date().toLocaleTimeString()
    const [date, setDate] = useState(new Date());
    const [properDate, setProperDate] = useState(today)
    const [properTime, setProperTime] = useState(todayTime)
    const [subject, setSubject] = useState("Call")
    const [state, setState] = useState("Done")
    const [priorty, setPriorty] = useState("High")
    const [note, setNote] = useState("")

    // Update Lead Status
    // Lead status
    const [newStatus, setNewStatus] = useState(status == "new" ? true : false)
    const [qualifiedStatus, setQualifiedStatus] = useState(status == "qualified" ? true : false)
    const [negotiationStatus, setNegotiationStatus] = useState(status == "negotiation" ? true : false)
    const [coldStatus, setColdStatus] = useState(status == "cold" ? true : false)
    const [wonStatus, setWonStatus] = useState(status == "won" ? true : false)
    const [rejectedStatus, setRejectedStatus] = useState(status == "rejected" ? true : false)

    const [viewstatus, setViewStatus] = useState("new")


    const updateLeadStatus = async (statuses) => {
        setLoading(true)
        try {
            await firestore()
                .collection('leads')
                .doc(id)
                .update({
                    status: statuses
                })
                .then(() => {
                    console.log("Lead Status Updated")
                    setLoading(false)
                    navigation.pop(2)
                })
        } catch (err) {
            console.log(err)
            setLoading(false)
            console.log(
                "Error occured",
            )
            return false
        }
    }

    const StatusHandler = (text) => {
        switch (true) {
            case (text == "new"):
                setNewStatus(true)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(false)
                updateLeadStatus("new")
                setViewStatus("new")

                break;
            case (text == "qualified"):
                setNewStatus(false)
                setQualifiedStatus(true)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(false)
                updateLeadStatus("qualified")
                setViewStatus("qualified")
                break;
            case (text == "negotiation"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(true)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(false)
                updateLeadStatus("negotiation")
                setViewStatus("negotiation")
                break;
            case (text == "cold"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(true)
                setWonStatus(false)
                setRejectedStatus(false)
                updateLeadStatus("cold")
                setViewStatus("cold")
                break;
            case (text == "won"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(true)
                setRejectedStatus(false)
                updateLeadStatus("won")
                setViewStatus("won")
                break;
            case (text == "rejected"):
                setNewStatus(false)
                setQualifiedStatus(false)
                setNegotiationStatus(false)
                setColdStatus(false)
                setWonStatus(false)
                setRejectedStatus(true)
                updateLeadStatus("rejected")
                setViewStatus("rejected")
                break;
            default:
                break;
        }
    }




    const leadModalHandler = () => {
        setLeadsModal(true)
        getUsersList()
    }

    useEffect(() => {
        getLeads()
    }, [])

    const getLeads = async () => {
        setLoading(true)
        const response = await LeadAPI.getLeadInventory(id)
        // console.log("response>leads>>>>", response)
        if (response && response.length > 0) {
            setInventory(response)
            setLoading(false)
        }
        else {
            setLoading(false)
            setInventory([])
        }
    }


    // Create Task on Call button with predefine Button
    const CreateTasks = async () => {
        setLoading(true)
        try {
            const res = await TaskApi.createNewTask(
                user.uid,
                leadName,
                subject,
                properDate,
                properTime,
                state,
                priorty,
                inventories,
                inventories,
                leads,
                leads,
                note,
                role == "own" ? businessID : user.uid,
                role,
                user.displayName,
                leads ? leads : null,
                firestore.Timestamp.fromDate(new Date()),
            )
            if (res) {
                setLoading(false)
                navigation.goBack()
                showPhonePad()
            }
            else {
                setLoading(false)
            }

        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }



    const getUsersList = async () => {
        setLoading(true)
        const userID = user.uid
        const response = await UsersAPI.getLeadUsers(userID)
        // console.log("response>leads>>>>", response)
        if (response && response.length > 0) {
            setUsers(response)
            setLoading(false)
        }
        else {
            setLoading(false)
            setUsers([])
        }
    }

    const showPhonePad = () => {
        let newNumber = mobile.split('-').join('')
        console.log(newNumber)
        // let nuber = newNumber.substring(1)
        // console.log(nuber)
        let phoneNumber = `tel:${newNumber}`
        console.log(phoneNumber)
        Linking.openURL(phoneNumber)
    }

    const whatsAppOpen = () => {
        // Linking.openURL('whatsapp://app')
        Linking.openURL('http://api.whatsapp.com/send?phone=92' + mobile +
            "&text=" + MESSAGE)
    }

    const reassignLeadHandler = async (uid) => {
        setLoading(true)
        try {
            await firestore()
                .collection('leads')
                .doc(id)
                .update({
                    user_id: uid,
                })
                .then(() => {
                    console.log("Lead Reassigned Succesfully")
                    if (hasInventory == true) {
                        reassignInventoryHandler(uid)
                    }
                    else {
                        setLoading(false)
                        Alert.alert("Lead Reassigned Successfully")
                        setLeadsModal(false)
                        navigation.goBack()
                    }
                    // navigation.goBack()
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
            setLeadsModal(false)
        }
    }

    const reassignInventoryHandler = async (uid) => {
        setLoading(true)
        try {
            await firestore()
                .collection('Inventory')
                .doc(inventoryID)
                .update({
                    user_id: uid,
                })
                .then(() => {
                    if (hasTask == true) {
                        reassignTaskHandler(uid)
                    }
                    else {
                        setLoading(false)
                        Alert.alert("Lead Reassigned Successfully")
                        setLeadsModal(false)
                        navigation.goBack()
                    }
                    // setLoading(false)
                    // Alert.alert("Lead Reassigned Successfully")
                    // setLeadsModal(false)
                    // navigation.goBack()
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
            setLeadsModal(false)
        }
    }

    const reassignTaskHandler = async (uid) => {
        setLoading(true)
        try {
            await firestore()
                .collection('Tasks')
                .doc(taskID)
                .update({
                    user_id: uid,
                })
                .then(() => {
                    setLoading(false)
                    Alert.alert("Lead Reassigned Successfully")
                    setLeadsModal(false)
                    navigation.goBack()
                })
        } catch (error) {
            console.log(error)
            setLoading(false)
            setLeadsModal(false)
        }
    }

    const closeModalHandler = () => {
        setLeadsModal(false)
    }

    return (
        <View style={styles.body}>
            {
                loading ?
                    <Spinner visible={true} />
                    :
                    null
            }

            {/* Header */}
            <View style={[HeaderStyle.mainContainer, { marginBottom: 10 }]}>
                <View style={HeaderStyle.arrowbox}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon1 name="left" color="#1A1E25" size={20} />
                    </TouchableOpacity>
                </View>
                <View style={HeaderStyle.HeaderTextContainer}>
                    <Text style={HeaderStyle.HeaderText}>Lead Details</Text>
                    <Image style={HeaderStyle.HeaderImage} resizeMode='contain' source={{ uri: user.photoURL }} />
                </View>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: "#FCFCFC" }}>

                {/* Body Container */}
                <View style={{ width: '90%', alignSelf: "center" }}>

                    {/* Lead info */}
                    <View style={{ marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: "#1A1E25" }}>{leadName}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 12, fontWeight: '400', color: '#7D7F88', marginRight: 15 }}>Client</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('UpdateLeads', { AllleadData: items, property_image: inventory.length > 0 ? inventory[0].propertyImg : null })}>
                                    <Text style={{ fontSize: 12, fontWeight: '400', color: '#917AFD' }}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                            {/* <View style={{flexDirection:'row', alignItems:'center'}}> */}
                            <Text style={{ fontSize: 12, fontWeight: '400', color: "#1A1E25", marginRight: 15 }}>{mobile}</Text>

                            {/* </View> */}
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '20%'
                            }}>
                                <TouchableOpacity onPress={() => CreateTasks()} style={{
                                    borderColor: '#917AFD',
                                    borderWidth: 1,
                                    padding: 5,
                                    borderRadius: 50
                                }}>
                                    <Icon
                                        name='call'
                                        color="#917AFD"
                                        size={15}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => whatsAppOpen()}>
                                    <Icon2
                                        name='whatsapp'
                                        color="green"
                                        size={25}
                                    />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginVertical: 20 }} />
                    {
                        name != user.displayName ?
                            <>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View>
                                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25' }}>Lead Created By:</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#7D7F88', marginTop: 5, fontStyle: 'italic' }}>{name}</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => leadModalHandler()}>
                                        <Text style={{ color: '#917AFD', fontSize: 14, fontWeight: '500' }}>Change</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginVertical: 20 }} />
                            </>
                            : null
                    }


                    {/* Created By */}
                    {
                        role == "business" && name !== user.displayName ?
                            <View style={{ marginTop: 20 }}>
                                <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Created By:</Text>
                                <Text style={{ fontSize: 16, fontWeight: '400', color: '#7D7F88', marginTop: 5, fontStyle: 'italic' }}>{name}</Text>
                            </View> : null
                    }


                    {/* Property Catagory */}
                    <Text style={{ fontSize: 20, fontWeight: '600', color: '#1A1E25', }}>
                        {catagory == "Residentiol" ? "Residential" : catagory == "Comercial" ? "Commercial" : "Semi-Commercial"}
                    </Text>
                    <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                            <Icon
                                name='location-sharp'
                                color="#7D7F88"
                                size={15}
                            />
                            <Text style={{ fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                                {societyName}
                            </Text>
                        </View>
                        {
                            bedroomsQuantity > 0 ?
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                                    <Icon
                                        name='bed'
                                        color="#7D7F88"
                                        size={15}
                                    />
                                    <Text style={{ fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88', }}>
                                        {bedroomsQuantity} Room
                                    </Text>
                                </View>
                                : null
                        }
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Image source={require('../../assets/icons/Vector.png')} />
                            <Text style={{ fontSize: 16, fontWeight: '400', marginLeft: 6, color: '#7D7F88' }}>
                                {size} {size_type}
                            </Text>
                        </View>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />

                    {/* Unit Type  */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25' }}>Type</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: "#7D7F88" }}>{property_type}</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 10 }} />

                    {
                        inventoryProperty !== "" ?
                            <>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25' }}>Inventory Property</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: "#7D7F88" }}>{inventoryProperty}</Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 10 }} />
                            </>
                            : null
                    }

                    <Text style={[styles.textHeading, { marginTop: 15 }]}>
                        Lead Status
                    </Text>
                    <View style=
                        {{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            alignSelf: "center",

                            // width: "92%",
                            // marginLeft: 12

                        }}
                    >
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={propertyStyles.container}>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { backgroundColor: newStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("new")}>
                                <Text style={[propertyStyles.type, { color: newStatus ? 'white' : '#7D7F88' }]}>New</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: qualifiedStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("qualified")}>
                                <Text style={[propertyStyles.type, { color: qualifiedStatus ? 'white' : '#7D7F88' }]}>Qualified</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: negotiationStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("negotiation")}>
                                <Text style={[propertyStyles.type, { color: negotiationStatus ? 'white' : '#7D7F88' }]}>Negotiation</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, , { marginHorizontal: 5, backgroundColor: coldStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("cold")}>
                                <Text style={[propertyStyles.type, { color: coldStatus ? 'white' : '#7D7F88' }]}>Cold</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: wonStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("won")}>
                                <Text style={[propertyStyles.type, { color: wonStatus ? 'white' : '#7D7F88' }]}>Won</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[propertyStyles.typeContainer, , { marginLeft: 5, backgroundColor: rejectedStatus ? '#917AFD' : '#F2F2F3' }]} onPress={() => StatusHandler("rejected")}>
                                <Text style={[propertyStyles.type, { color: rejectedStatus ? 'white' : '#7D7F88' }]}>Rejected</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        {/* <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={propertyStyles.container}>
                            <View style={[propertyStyles.typeContainer, { backgroundColor: status == "new" ? '#917AFD' : '#F2F2F3' }]}>
                                <Text style={[propertyStyles.type, { color: status == "new" ? 'white' : '#7D7F88' }]}>New</Text>
                            </View>
                            <View style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: status == "qualified" ? '#917AFD' : '#F2F2F3' }]} >
                                <Text style={[propertyStyles.type, { color: status == "qualified" ? 'white' : '#7D7F88' }]}>Qualified</Text>
                            </View>
                            <View style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: status == "negotiation" ? '#917AFD' : '#F2F2F3' }]} >
                                <Text style={[propertyStyles.type, { color: status == "negotiation" ? 'white' : '#7D7F88' }]}>Negotiation</Text>
                            </View>
                            <View style={[propertyStyles.typeContainer, , { marginHorizontal: 5, backgroundColor: status == "cold" ? '#917AFD' : '#F2F2F3' }]} >
                                <Text style={[propertyStyles.type, { color: status == "cold" ? 'white' : '#7D7F88' }]}>Cold</Text>
                            </View>
                            <View style={[propertyStyles.typeContainer, { marginHorizontal: 5, backgroundColor: status == "won" ? '#917AFD' : '#F2F2F3' }]} >
                                <Text style={[propertyStyles.type, { color: status == "won" ? 'white' : '#7D7F88' }]}>Won</Text>
                            </View>
                            <View style={[propertyStyles.typeContainer, , { marginLeft: 5, backgroundColor: status == "rejected" ? '#917AFD' : '#F2F2F3' }]} >
                                <Text style={[propertyStyles.type, { color: status == "rejected" ? 'white' : '#7D7F88' }]}>Rejected</Text>
                            </View>
                        </ScrollView> */}
                    </View>


                    <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 10 }} />
                    {/* Unit Type  */}

                    {
                        unitType !== "" ?
                            <>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25', marginTop: 10 }}>Unit</Text>
                                <View style={styles.portionContainer}>
                                    <View
                                        style={[styles.BtnPropertyType, { backgroundColor: unitType == "Single" ? '#826AF7' : '#F2F2F3' }]}>
                                        <Text style={[styles.ButtonText, { color: unitType == "Single" ? '#FFFFFF' : '#7D7F88', }]}>Single</Text>
                                    </View>
                                    <View
                                        style={[styles.BtnPropertyType, { backgroundColor: unitType == "Double" ? '#826AF7' : '#F2F2F3' }]}>
                                        <Text style={[styles.ButtonText, { color: unitType == "Double" ? '#FFFFFF' : '#7D7F88', }]}>Double</Text>
                                    </View>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />
                            </> : null
                    }


                    {/* Portion Type */}
                    {
                        property_type === "Rent" || property_type === "Let" ?
                            <>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1E25', marginTop: 10 }}>Portion</Text>
                                <View style={[styles.portionContainer, { width: '90%' }]}>
                                    <View
                                        style={[styles.BtnPropertyType, { backgroundColor: portion_type == "Complete" ? '#826AF7' : '#F2F2F3' }]}>
                                        <Text style={[styles.ButtonText, { color: portion_type == "Complete" ? '#FFFFFF' : '#7D7F88', }]}>Complete</Text>
                                    </View>
                                    <View
                                        style={[styles.BtnPropertyType, { backgroundColor: portion_type == "FirstFloor" ? '#826AF7' : '#F2F2F3' }]}>
                                        <Text style={[styles.ButtonText, { color: portion_type == "FirstFloor" ? '#FFFFFF' : '#7D7F88', }]}>First Floor</Text>
                                    </View>
                                    <View
                                        style={[styles.BtnPropertyType, { backgroundColor: portion_type == "SecondFloor" ? '#826AF7' : '#F2F2F3' }]}>
                                        <Text style={[styles.ButtonText, { color: portion_type == "SecondFloor" ? '#FFFFFF' : '#7D7F88', }]}>Second Floor</Text>
                                    </View>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />
                            </> : null
                    }


                    {/* {
                        portion_type != "" ?
                            <>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '400', color: '#7D7F88' }}>Portion</Text>
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: "#1A1E25" }}>{portion_type}</Text>
                                </View>
                                <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 10 }} />
                            </>
                            :
                            null
                    } */}

                    {/* Property Facilities */}
                    <Text style={[styles.textHeading, { marginTop: 10, marginBottom: 5 }]}>
                        Lead Preference
                    </Text>
                    <View style={styles.facilitiesContainer}>
                        <View style={[styles.facilities, { width: 109, backgroundColor: facilities.gas ? '#917AFD' : '#F2F2F3' }]}>
                            <Text style={[styles.facilitiesText, { color: facilities.gas ? 'white' : '#7D7F88' }]}>Sui Gas</Text>
                        </View>
                        <View style={[styles.facilities, { width: 109, backgroundColor: facilities.facingPark ? '#917AFD' : '#F2F2F3' }]} >
                            <Text style={[styles.facilitiesText, { color: facilities.facingPark ? 'white' : '#7D7F88' }]}>Facing Park</Text>
                        </View>
                        <View style={[styles.facilities, { width: 109, backgroundColor: facilities.mainRoad ? '#917AFD' : '#F2F2F3' }]} >
                            <Text style={[styles.facilitiesText, { color: facilities.mainRoad ? 'white' : '#7D7F88' }]}>Main Road</Text>
                        </View>
                        <View style={[styles.facilities, { width: 109, marginTop: 25, backgroundColor: facilities.corner ? '#917AFD' : '#F2F2F3' }]} >
                            <Text style={[styles.facilitiesText, { color: facilities.corner ? 'white' : '#7D7F88' }]}>Corner</Text>
                        </View>
                        <View style={[styles.facilities, { width: 109, backgroundColor: facilities.gated ? '#917AFD' : '#F2F2F3' }]} >
                            <Text style={[styles.facilitiesText, { color: facilities.gated ? 'white' : '#7D7F88' }]}>Gated</Text>
                        </View>
                        <View style={[styles.facilities, { width: 109, backgroundColor: facilities.ownerBuild ? '#917AFD' : '#F2F2F3' }]}>
                            <Text style={[styles.facilitiesText, { color: facilities.ownerBuild ? 'white' : '#7D7F88' }]}>Owner Built</Text>
                        </View>
                    </View>
                    <View style={{ borderColor: '#E2E2E2', borderWidth: 1, marginVertical: 10 }} />

                    {/* Description */}
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1A1E25' }}>Description</Text>
                        <Text style={{ fontSize: 16, fontWeight: '400', color: '#7D7F88', marginTop: 5, fontStyle: 'italic' }}>{description ? description : "You have no description"}</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} />

                    {/* <View style={{marginTop:15}}>
                        <Image 
                            source={require('../../assets/images/map.png')}  
                            style={{width: '100%', height: 209, }}
                        />
                    </View> */}
                    {/* <View style={{ borderBottomWidth: 1, borderColor: "#E2E2E2", marginTop: 20 }} /> */}
                    {console.log(">>>>>>>>>>",inventory)}

                    {
                        inventory.length > 0 ?
                            inventory.map((item) => (


                                <InventoryCard
                                    houseName={item.houseName}
                                    propertyImg={item.propertyImg}
                                    rent={item.demand}
                                    catagory={item.catagory}
                                    transactionType={item.transactionType}
                                    address={item.societyName + ", " + item.cityName}
                                    rooms={item.rooms.bedrooms}
                                    area={item.size}
                                    propertyType={item.propertyType}
                                    areatype={item.sizeType}
                                    navigate={() => navigation.navigate('InventoryDetailScreen', item)}
                                />

                            ))
                            : null
                    }
                    <TouchableOpacity style={{
                        borderColor: '#917AFD',
                        borderWidth: 1,
                        borderRadius: 54,
                        height: 48,
                        backgroundColor: 'rgba(145, 122, 253, 0.07)',
                        justifyContent: 'center',
                        marginBottom: 15,
                        marginTop: 15
                    }}
                        onPress={() => navigation.navigate('LeadTasks', { "id": id, "items": items })}
                    >
                        <Text style={{
                            color: '#917AFD',
                            alignSelf: 'center',
                            fontSize: 17,
                            fontWeight: '700',
                            fontFamily: 'SF Pro Text'
                        }}>View Tasks</Text>
                    </TouchableOpacity>



                    {/* View Task Button */}
                    {/* <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Tasks')}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#917AFD' }}>View Tasks</Text>
                    </TouchableOpacity> */}
                </View>
            </ScrollView>

            {/* Payment Detail */}
            <View style={{ width: '100%', alignSelf: 'center', elevation: 9, backgroundColor: 'white' }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#917AFD', margin: 10 }}>{property_type == "Let" || property_type == "Sale" ? "Demand" : "Budget"}</Text>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1A1E25', marginLeft: 10, marginBottom: 10 }}>PKR {budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} {property_type == "Buy" || property_type == "Sale" ? "" : "/ month"}</Text>
                {/* <Text style={{ fontSize: 14, fontWeight: '400', color: '#1A1E25',textDecorationLine:'underline' }}>Payment Estimation</Text> */}
            </View>

            {/* REASSIGN LEADS MODAL */}
            <Modal visible={showLeadsModal} animationType='slide' transparent={true}>
                <View style={{ backgroundColor: '#D3D3D3', opacity: 0.5, height: '40%' }}></View>
                <View style={{ height: '60%', elevation: 7, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View />
                        <Text style={{ fontSize: 18, color: 'black', alignSelf: 'center', fontWeight: '700' }}>Select User to Reassign Lead</Text>
                        <TouchableOpacity
                            style={[styles.closeIconContainer, { margin: 10 }]}
                            onPress={() => closeModalHandler()}
                        >
                            <Icon1
                                name='close'
                                color="black"
                                size={25}
                            />
                        </TouchableOpacity>
                    </View>

                    {
                        users && users.length > 0 ?
                            <FlatList
                                data={users}
                                keyExtractor={(stock) => stock.id}
                                renderItem={({ item, index }) => {
                                    return (
                                        <LeadCard
                                            name={item.name}
                                            mobile={item.contact}
                                            assign={() => reassignLeadHandler(item.uid)}
                                        />
                                    )
                                }}
                                refreshControl={<RefreshControl refreshing={false} onRefresh={getUsersList} />}
                            />
                            :
                            <Text style={styles.errorText}>No Users Found</Text>
                    }


                </View>

            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: '#fbfcfa'
    },
    header: {
        flexDirection: 'row',
        width: '95%',
        alignSelf: 'center',
        // borderColor: 'red',
        // borderWidth: 1,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerIconContainer: {
        backgroundColor: '#FCFCFC',
        borderWidth: 0.5,
        borderRadius: 50,
        borderColor: '#E3E3E7',
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 7,
        margin: 20
    },
    portionContainer: {
        width: "60%",
        flexDirection: 'row',
        justifyContent: "space-between",
        marginTop: 15,

    },
    BtnPropertyType: {
        flex: 1,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
        borderRadius: 100
    },
    ButtonText: {
        fontWeight: "400",
        fontSize: 12,
        fontWeight: "normal"
    },

    headerIconContainerMove: {
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 1,
        margin: 30,
    },

    imageText: {
        backgroundColor: "#FCFCFC",
        width: 58,
        height: 25,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: 60,
        marginRight: 30,
        elevation: 10,
    },

    headerText: {
        fontFamily: 'Lato',
        fontWeight: '700',
        fontSize: 21,
        color: '#404040'
    },

    favoriteIcon: {
        width: 20,
        height: 17.8,
        marginTop: 5,
    },

    inventoryCard: {
        width: '95%',
        alignSelf: 'center',
        borderColor: '#c3c3c3',
        borderWidth: 1,
        marginTop: 30,
        marginBottom: 15,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 5,
        elevation: 9,
        backgroundColor: 'white',
        overflow: 'hidden'
    },

    btn: {
        backgroundColor: '#F2F0FB',
        marginTop: 18,
        height: 48,
        borderWidth: 1.5,
        borderRadius: 54,
        borderColor: '#917AFD',
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        width: '100%',
        alignSelf: 'center',
        // borderColor:'red',
        // borderWidth:1,
        marginBottom: 20,
        marginTop: 10,
        flexDirection: 'row',
        // padding:5,
        backgroundColor: 'white',
        // height: 150,
        elevation: 2,
        borderRadius: 10,
        overflow: 'hidden',
        flex: 1
    },
    imageContainer: {
        width: '25%',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1
    },
    detailsContainer: {
        width: '70%',
        // borderColor:'blue',
        // borderWidth:1,
        marginLeft: 10,
        // justifyContent:'space-between'
    },
    rating: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        fontStyle: 'normal',
        // marginTop: 10
    },
    houseName: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '800',
        fontSize: 16,
        fontStyle: 'normal',
        marginTop: 10
    },
    houseAddress: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal',
        // flex: 1,
        marginLeft: 3
        // marginTop: 5
    },
    property: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        fontStyle: 'normal',
        // flex: 1,
        marginLeft: 3
    },
    houseRent: {
        color: '#1A1E25',
        fontFamily: 'SF Pro Text',
        fontWeight: '700',
        fontSize: 18,
        fontStyle: 'normal',
        marginTop: 10
        // alignSelf:'flex-end'
    },
    rentType: {
        color: '#7D7F88',
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 13,
        fontStyle: 'normal'
    },
    typeText: {
        color: '#826AF7',
        fontFamily: 'Lato',
        fontWeight: '900',
        fontSize: 14, marginTop: 5
    },
    closeIconContainer: {
        backgroundColor: '#FDFDFD',
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: '#E3E3E7',
        width: 34,
        height: 34,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        alignSelf: 'flex-end'
    },
    contactCard: {
        width: '95%',
        alignSelf: 'center',
        // borderColor: 'red',
        // borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        marginTop: 15,
        elevation: 2,
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 5
    },
    leadName: {
        fontSize: 15,
        fontWeight: '600',
        color: "#1A1E25",
        marginLeft: 15
    },
    phoneContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    phone: {
        fontSize: 13,
        fontWeight: '400',
        color: "#1A1E25",
        marginRight: 15
    },
    callButton: {
        borderColor: '#917AFD',
        borderWidth: 1,
        padding: 5,
        borderRadius: 50,
        marginRight: 10
    },
    errorText: {
        color: '#917AFD',
        alignSelf: 'center',
        marginTop: '20%',
        fontSize: 25,
        fontWeight: 'bold',
        elevation: 6
    },
    // Leasd status styles
    textHeading: {
        color: "#1A1E25",
        fontSize: 14,
        fontWeight: "900",
    },
    facilitiesContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 10,
        // width: '70%',
        justifyContent: 'space-between',
        marginBottom: 15,
        flexWrap: 'wrap',
        // marginLeft: 10
    },
    facilities: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        height: 40,
        width: 77,
        // flex:1,
        elevation: 1
    },
    facilitiesText: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 16,
        color: '#7D7F88'
    },
})
const propertyStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        // borderColor:'green',
        // borderWidth:1,
        marginTop: 10,
        // width:'60%',
        justifyContent: 'space-between',
        marginBottom: 10
    },


    typeContainer: {
        backgroundColor: '#F2F2F3',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E3E3E7',
        borderWidth: 0.8,
        borderRadius: 92,
        // paddingHorizontal: 10,
        height: 30,
        width: 80,
        // elevation: 7,
        marginVertical: 5
    },
    type: {
        fontFamily: 'SF Pro Text',
        fontWeight: '400',
        fontSize: 12,
        color: '#7D7F88'
    },
})